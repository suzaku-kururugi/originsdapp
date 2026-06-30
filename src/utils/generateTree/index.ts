import type { ContractData, LocalData,  LinkInterface } from "../../utils/types";

export const generateTree = (familyArray: ContractData[]) => {
  // Search all family members without parents
  const mainParents = familyArray.filter(member => member?.p?.length === 0); // start of tree
  
  // create objects with key name is member id
  const familyTree = createNodes(mainParents);

  // Go through keys of mainParents and add them childrens
  generateChildrenNodes(familyTree, familyArray);
  
  return familyTree;
}

const generateChildrenNodes = (object: any, familyArray: any[]) => {
  for (let item in object) {
    // Find childrens of this parent
    const childrens = findChildrens(familyArray, item);

    object[item].children = createNodes(childrens);

    generateChildrenNodes(object[item].children, familyArray);
  }
}

const findChildrens = (familyArray: any[], item: string) => {
  return familyArray.filter(member => member.p.find((parent: any) => parent.toString() === item));
}

const createNodes = (array: any[]): {[key: string]: any} => {
  const object: any = {};
  array.forEach(item => {
    const {id, ...rest} = item;
    const node = {
      ...rest,
      children: {}
    };

    object[id.toString()] = node;
  });

  return object;
}

export const createLinks = (familyArray: any[]) => {
  const linkData: any[] = [];

  familyArray.forEach((node, index) => {
    if (node.partners) {
      node.partners.forEach((partnerID: number) => {
        linkData.push({ source: node, target: familyArray.find(partnerNode => partnerNode.id === partnerID), relationship: 'Partner' });
      })
    }
    if (node.children) {
      node.children.forEach((childID: number) => {
        const childNode = familyArray.find(childNode => childNode.id === childID);
        if (node.children.length > 1) {
          childNode.siblings = node.children.slice(0, node.children.indexOf(childNode.id)).concat(node.children.slice(node.children.indexOf(childNode.id) + 1, node.children.length));
          childNode.siblings.forEach((siblingID: any) => {
            linkData.push({ source: childNode, target: familyArray.find(siblingNode => siblingNode.id === siblingID), relationship: 'Sibling' });
          })
        }
        linkData.push({ source: node, target: childNode, relationship: 'Child' });
      })
    }
  });

  return linkData as LinkInterface[];
}



function assignGeneration(nodes: any[], generationNodes: any[], generationCount: number) {
  const childNodes: any = [];
  generationNodes.forEach(function (node) {
    if (node.children) {
      // Node has children
      node.generation = generationCount + 1;
      node.children.forEach((childID: any) => {
        if (!childNodes.find((childNode: any) => childNode.id === childID)) {
          childNodes.push(generationNodes.find(childNode => childNode.id === childID));
        }
      })
    } else {
      if (node.partners) {
        node.partners.forEach((partnerID: any) => {
          if (generationNodes.find(partnerNode => partnerNode.id === partnerID && partnerNode.children)) {
            // Node has partner with children
            node.generation = generationCount + 1;
          }
        })
      } else {
        // Use generation of parent + 1
        const parent = nodes.find(parentNode => parentNode.children && parentNode.children.indexOf(node.id) !== -1);
        node.generation = parent.generation + 1;
      }
    }
  });
  if (childNodes.length > 0) {
    return assignGeneration(nodes, childNodes, generationCount += 1);
  } else {
    nodes.filter(node => !node.generation).forEach(function (node) {
      node.generation = generationCount + 1;
    });
    return nodes;
  }
}

const updateParentGenerations = (nodesArray: any[]) => {
  const correctedNodes = nodesArray.map((node: any) => {
    const childrens = node.children;
    const partners = node.partners;
    
    if (!node.parents.length) {
      if (childrens.length && partners.length) {
        let correctGeneration = node.generation;

        // Calculate most old partner generation
        const partnersGenerations: number[] = [];
        partners.forEach((partner: any) => {
          const partnerGen = nodesArray.find(node => node.id === partner)?.generation;
          partnersGenerations.push(partnerGen);
        });
        const minPartnerGeneration = Math.min(...partnersGenerations);
        correctGeneration = minPartnerGeneration;
        
        node['generation'] = correctGeneration;
        return node;
      }

      return node
    } else {
      return node;
    }
  })

  return correctedNodes;
}

export const convertDataForGraph = (familyArray: LocalData[]) => {
  const nodesWithChildren = assignChildrens(familyArray);
  const links = createLinks(nodesWithChildren);
  const nodesWithGenerations = assignGeneration(nodesWithChildren, nodesWithChildren, 0);
  // Make generations values more accure
  const nodes = updateParentGenerations(nodesWithGenerations);

  const convertedObject = {
    nodes,
    links
  }

  return convertedObject;
}

export const assignChildrens = (familyArray: LocalData[]) => {
  const extendedArray = familyArray.map((item: LocalData): LocalData & { children: number[] } => {
    return {
      ...item,
      children: []
    }
  });

  extendedArray.forEach((member, i) => {
    if (member.parents.length) {
      member.parents.map(parentId => extendedArray.find(item => item.id === parentId)?.children.push(member.id))
    }
  });

  return extendedArray;
}
