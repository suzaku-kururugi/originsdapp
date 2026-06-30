import { LocalData } from "../../utils/types";

export const compareArraysLength = (contractDataLength: number, localDataLength: number): boolean => {
  return contractDataLength === localDataLength ? true : false;
}

export const compareObjectsIds = (contractData: LocalData[], currentData: LocalData[]): boolean => {
  // extract id for comparison
  const currentIds = new Set(currentData.map(item => item.id));
  const contractIds = new Set(contractData.map(item => item.id));

  // Check that all contractIds are in currentIds
  for (const id of contractIds) {
    if (!currentIds.has(id)) {
      return false;
    }
  }

  // Check currentIds doesn't contain extra id
  for (const id of currentIds) {
    if (!contractIds.has(id)) {
      return false;
    }
  }

  // All good return true
  return true;
};

export const compareObjectKeysAndValues = (contractData: LocalData[], currentData: LocalData[]): boolean => {
  return contractData.every(contractElement => {
    const contractJSON = JSON.stringify(contractElement);
    const currentElementJSON = JSON.stringify(currentData.find(element => element.id === contractElement.id));

    return contractJSON === currentElementJSON;
  })
}
