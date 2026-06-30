import { LinkInterface } from "../../../utils/types";
import { drag } from "d3-drag";
import moment from "moment";
import { getCroppedImgFromUrl } from "../../../utils";
import { Crop } from "react-image-crop";
import lodash from "lodash";

type HandleMoveType = (id: string, x: number, y: number) => void
interface FamilyNodeSizeInterface {
  width: number;
  height: number;
}

export const drawFamilyNodeItem = (
  selection: any,
  userAddress: `0x${string}` | undefined,
  memberData: any,
  handleMove: HandleMoveType,
  handleMoreInfoClick: (e: any) => void,
  handleDataWasChanged: () => void,
  nodeSize: FamilyNodeSizeInterface,
  svgWidth?: number,
  swgHeight?: number
) => {
  if (!memberData) {
    return
  }

  const { name, dateOfBirth, id, x , y, photoUrl, avatarParams } = memberData;
  const swgW = svgWidth ? svgWidth / 2 : 50;
  const swgH = swgHeight ? swgHeight / 2 : 50;
  const { height: rectH, width: rectW} = nodeSize;

  const group = selection.append("g")
    .attr("transform", `translate(${x || swgW}, ${y || swgH})`)
    .attr("id", id)
    .datum({...memberData});

  
  const dragHandler = (event: any, d: any) => {
    
    const transform = group.attr("transform");
    
    const translate = transform ? transform.match(/translate\(([^,]+),([^,]+)\)/) : null;
    const currentX = translate ? parseFloat(translate[1]) : 0;
    const currentY = translate ? parseFloat(translate[2]) : 0;
    
    const newX = currentX + event.dx;
    const newY = currentY + event.dy;
    
    handleMove(memberData.id, newX, newY);

    group.attr("transform", `translate(${newX}, ${newY})`)
      .datum({ x: newX, y: newY });

    const lines = Array.from(selection.selectAll("line")._groups[0]);

    lines.filter((line: any) => {
      const lineData = line.__data__;

      if (lineData.source.id === id) {
        line.setAttribute("x1", newX + (rectW / 2))
        line.setAttribute("y1", newY + (rectH / 2))
      }

      if (lineData.target.id === id) {
        line.setAttribute("x2", newX + (rectW / 2))
        line.setAttribute("y2", newY + (rectH / 2))
      }
    })
  };

  const dragEndHandler = (event: any, d: any) => {
    const transform = group.attr("transform");
    const translate = transform ? transform.match(/translate\(([^,]+),([^,]+)\)/) : null;
    const finalX = translate ? parseFloat(translate[1]) : 0;
    const finalY = translate ? parseFloat(translate[2]) : 0;
  
    const savedUserData = localStorage.getItem(`${userAddress}`);
    const userData = savedUserData ? JSON.parse(savedUserData) : { data: [] };
  
    const updatedData = userData.data.map((item: any) => {
      if (item.id === id) {
        return { ...item, x: finalX, y: finalY };
      }
      return item;
    });
  
    localStorage.setItem(`${userAddress}`, JSON.stringify({ ...userData, data: updatedData }));
    handleDataWasChanged()
  };

  const renderPhoto = photoUrl[0] ? photoUrl[0] : "/avatar_default.png";

  drawMemberRect(group, handleMoreInfoClick, rectH, rectW, dateOfBirth, name, renderPhoto, avatarParams);


  // For debugging 
//   const coordsGroup = group.append("g")
//     .attr("transform", `translate(${60}, ${rectH - 30})`)
//     .attr("font-size", 8)
//     ;
//   const xText = coordsGroup.append("text")
//   .attr("x", 0)
//   .attr("y", 0)
//   .attr("font-family", "Poppins")
//   .attr("font-weight", "normal")
//   .attr("fill", "#3C312B")
//   .text(`x: ${ memberData.x || swgW }`); 

// const yText = coordsGroup.append("text")
//   .attr("x", 0)
//   .attr("y", 16)
//   .attr("font-family", "Poppins")
//   .attr("font-weight", "normal")
//   .attr("fill", "#3C312B")
//   .text(`y: ${ memberData.y || swgH }`); 

  // const updateCoordinates = () => {
  //   xText.text(`x: ${parseFloat(group.attr("transform").split(",")[0].split("(")[1])}`);
  //   yText.text(`y: ${parseFloat(group.attr("transform").split(",")[1].split(")")[0])}`);
  // };

  group.call(drag()
    .on("drag", dragHandler)
    .on("end", dragEndHandler));
};

export const drawLink = (selection: any, link: LinkInterface, nodes: any[], nodeSize: FamilyNodeSizeInterface) => {
  const { relationship, source, target } = link;
  const { width: nodeW, height: nodeH } = nodeSize;

  if (!source || !target) {
    return;
  }

  const sourceNode = nodes.find((node: any) => node.id === source.id);
  const targetNode =  nodes.find((node: any) => node.id === target.id);

  if (relationship === "Sibling") {
    return
  }
  
  const line = selection.append("line")
    .attr("x1", sourceNode.x + (nodeW / 2))
    .attr("y1", sourceNode.y + (nodeH / 2))
    .attr("x2", targetNode.x + (nodeW / 2))
    .attr("y2", targetNode.y + (nodeH / 2))
    .attr("id", `${source.id}->${target.id}`)
    .datum({ ...link })


  if (relationship === "Partner") {
    line.style("stroke", "white")
      .style("stroke-width", 2)
      .style("stroke-dasharray", "5,5");
  } else {
    line.style("stroke", "#3C312B")
      .style("stroke-width", 2)
  }
}

const drawMemberRect = async (
  group: any,
  handleMoreInfoClick: (e: any) => void,
  rectH: number,
  rectW: number,
  dateOfBirth: any,
  name: string,
  photoUrl: string,
  avatarParams?: {
    crop: Crop,
    width: number,
    height: number
  }
) => {
  const circleRadius = (rectH * 0.5) / 2;
  const rectClipPathId = "clipPathRect";

  group
    .append("clipPath")
    .attr("id", rectClipPathId)
    .append("rect")
    .attr("width", rectW - 10)
    .attr("height", rectH)
    .attr("rx", 20)
    .attr("ry", 20);

  group
    .append("rect")
    .attr("width", rectW)
    .attr("height", rectH)
    .attr("rx", 20)
    .attr("ry", 20)
    .style("fill", "#F1E0C5")
    .style("stroke", "#3C312B")
    .style("stroke-width", 3);
  
  group.append("image")
    .attr("x", 110)
    .attr("y", -38)
    .attr("width", 160)
    .attr("height", 75)
    .attr("xlink:href", "/images/topBloss.png")

  group.append("image")
    .attr("x", 0)
    .attr("y", 86)
    .attr("width", 160)
    .attr("height", 113)
    .attr("xlink:href", "/images/bottomBloss.png")

    const circleXPos = rectW - (circleRadius + 20);
    const circleYPos = rectH / 2 + 20;
    const clipPathId = "circleClip";
    
    const imageGroup = group.append("g")
      .attr("transform", `translate(${circleXPos}, ${circleYPos})`);
    
    imageGroup
      .append("clipPath")
      .attr("id", clipPathId)
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", circleRadius);
    
    imageGroup
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", circleRadius)
      .style("fill", "white");
    

    let avatar = photoUrl;

    if (!lodash.isEmpty(avatarParams)) {
      avatar = await getCroppedImgFromUrl(photoUrl, avatarParams.crop, avatarParams.width, avatarParams.height)
    }

    imageGroup
      .append("image")
      .attr("x", -circleRadius)
      .attr("y", -circleRadius)
      .attr("width", circleRadius * 2)
      .attr("height", circleRadius * 2)
      .attr("xlink:href", avatar)
      .attr("clip-path", `url(#${clipPathId})`)
      .attr("preserveAspectRatio", "xMidYMid meet");

  const textGroup = group.append("g")
    .attr("transform", `translate(${0}, ${0})`);

  const textGroupDescriptionCoords = {
    x: 20,
    y: 40
  }

  textGroup
    .append("text")
    .attr("x", textGroupDescriptionCoords.x)
    .attr("y", textGroupDescriptionCoords.y)
    .attr("font-size", 17)
    .attr("font-weight", 400)
    .attr("font-family", "Poppins")
    .attr("font-weight", "normal")
    .attr("fill", "#3C312B")
    .attr("clip-path", `url(#${rectClipPathId})`)
    .text(`${name}`);

  textGroup
    .append("text")
    .attr("x", textGroupDescriptionCoords.x)
    .attr("y", textGroupDescriptionCoords.y + 20)
    .attr("font-size", 14)
    .attr("font-family", "Poppins")
    .attr("font-weight", "normal")
    .attr("fill", "#3C312B")
    .text(`Birthday: ${moment(dateOfBirth).format("L")}`);

  const moreInfoButtonPos = {
    x: 20,
    y: rectH / 2 + 10
  }

  const buttonGroup = group.append('g')
    .attr('cursor', 'pointer') 
    .on('click', handleMoreInfoClick) 
    .attr("transform", `translate(${moreInfoButtonPos.x}, ${moreInfoButtonPos.y})`);

  buttonGroup
    .append("rect")
    .attr("width", 60)
    .attr("height", 15)
    .attr("x", 0)
    .attr("y", 0)
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("fill", "#776344")

  buttonGroup
    .append("text")
    .attr("fill", "#FFFFF0")
    .attr("font-size", 8)
    .attr("font-family", "Poppins")
    .attr("font-weight", "normal")
    .attr("x", 10)
    .attr("y", 10)
    .text("More info".toUpperCase());
}

// const getCroppedAndResizedImgFromUrl = async (
//   imageUrl: string,
//   crop: Crop,
//   outputWidth: number,
//   outputHeight: number
// ): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const image = new Image();
//     image.crossOrigin = "anonymous"; 
//     image.src = imageUrl;

//     image.onload = () => {
//       const canvas = document.createElement('canvas');
//       const scaleX = image.naturalWidth / image.width;
//       const scaleY = image.naturalHeight / image.height;
//       canvas.width = crop.width;
//       canvas.height = crop.height;
//       const ctx = canvas.getContext('2d');
//       if (!ctx) {
//         reject(new Error('Failed to get canvas context'));
//         return;
//       }

//       ctx.drawImage(
//         image,
//         crop.x * scaleX,
//         crop.y * scaleY,
//         crop.width * scaleX,
//         crop.height * scaleY,
//         0,
//         0,
//         crop.width,
//         crop.height
//       );

//       const outputCanvas = document.createElement('canvas');
//       outputCanvas.width = outputWidth;
//       outputCanvas.height = outputHeight;
//       const outputCtx = outputCanvas.getContext('2d');
//       if (!outputCtx) {
//         reject(new Error('Failed to get output canvas context'));
//         return;
//       }

//       outputCtx.drawImage(canvas, 0, 0, outputWidth, outputHeight);

//       resolve(outputCanvas.toDataURL('image/jpeg'));
//     };

//     image.onerror = () => {
//       reject(new Error('Couldn't load an image'));
//     };
//   });
// };

/**
 * Deprecated version
 * @param group 
 * @param handleMoreInfoClick 
 * @param rectH 
 * @param rectW 
 * @param dateOfBirth 
 * @param name 
 */
const drawMemberRect2 = (
  group: any,
  handleMoreInfoClick: (e: any) => void,
  rectH: number,
  rectW: number,
  dateOfBirth: any,
  name: string
) => {
  const circleRadius = (rectH * 0.5) / 2;
  const rectClipPathId = "clipPathRect";

  group
    .append("clipPath")
    .attr("id", rectClipPathId)
    .append("rect")
    .attr("width", rectW - 10)
    .attr("height", rectH)
    .attr("rx", 20)
    .attr("ry", 20);

  group
    .append("rect")
    .attr("width", rectW)
    .attr("height", rectH)
    .attr("rx", 20)
    .attr("ry", 20)
    .style("fill", "#F1E0C5")
    .style("stroke", "#3C312B")
    .style("stroke-width", 2);

  const circleXPos = circleRadius + 10;
  const circleYpos = rectH / 4 + 10;
  const clipPathId = "circleClip";

  group
    .append("clipPath")
    .attr("id", clipPathId)
    .append("circle")
    .attr("cx", circleXPos)
    .attr("cy", circleYpos)
    .attr("r", circleRadius);

  group
    .append("circle")
    .attr("cx", circleXPos)
    .attr("cy", circleYpos)
    .attr("r", circleRadius)
    .style("fill", "white");

  group
    .append("image")
    .attr("x", 10)
    .attr("y", 10)
    .attr("width", rectH / 2)
    .attr("height", rectH / 2)
    .attr("xlink:href", "/images/chumba_rect.jpeg") // https://u.to/rO6jIA
    // .attr("xlink:href", "https://cryptologos.cc/logos/versions/ethereum-eth-logo-diamond-purple.svg?v=031") // https://u.to/rO6jIA
    .attr("clip-path", `url(#${clipPathId})`);

  group
    .append("text")
    .attr("x", rectW / 3)
    .attr("y", 36)
    .attr("font-size", 16)
    .attr("font-family", "Poppins")
    .attr("font-weight", "normal")
    .attr("fill", "#3C312B")
    .attr("clip-path", `url(#${rectClipPathId})`)
    .text(`${name}`);

  group
    .append("text")
    .attr("x", rectW / 3)
    .attr("y", 60)
    .attr("font-size", 14)
    .attr("font-family", "Poppins")
    .attr("font-weight", "normal")
    .attr("fill", "#3C312B")
    .text(`Birth day: ${moment(dateOfBirth).format("L")}`);

  const moreInfoButtonPos = {
    x: rectW / 2,
    y: rectH / 2
  }
  

  const buttonGroup = group.append('g')
    .attr('cursor', 'pointer')
    .on('click', handleMoreInfoClick);

  buttonGroup
    .append("rect")
    .attr("width", 60)
    .attr("height", 15)
    .attr("x", moreInfoButtonPos.x)
    .attr("y", moreInfoButtonPos.y)
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("fill", "#776344")

  buttonGroup
    .append("text")
    .attr("fill", "#FFFFF0")
    .attr("font-size", 8)
    .attr("font-family", "Poppins")
    .attr("font-weight", "normal")
    .attr("x", moreInfoButtonPos.x + 10)
    .attr("y", moreInfoButtonPos.y + 10)
    .text("More info".toUpperCase());   
}
