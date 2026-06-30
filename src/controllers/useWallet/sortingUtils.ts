import { isEqual } from "lodash";
import { convertToContractDataMapperV1 } from "../../utils";

interface DeleteInterface {
  iv: number[];
  data: Object[];
  index: number[];
}

interface InsertInterface {
  iv: string[];
  data: Object[];
  index: number[];
}

const collectDataToPush = async (toInsert: any, toUpdate: any, toDelete: any, encryptDataFunc: (dataToEncrypt: Record<string, any>) => Promise<any[]>) => {
  const dataArray: any = [];
  const indexesArray: any = [];

  if (toInsert.length) {
    const encryptedDataToInsert = await encryptDataFunc(toInsert.map((obj: any) => obj.data));

    encryptedDataToInsert.forEach((encryptedData) => {
      dataArray.push(encryptedData.data);
      indexesArray.push(-1)
    })
  }

  if (toUpdate.length) {
    const encryptedDataToUpdate = await encryptDataFunc(toUpdate.map((obj: any) => obj.data));

    encryptedDataToUpdate.forEach((encryptedData) => {
      dataArray.push(encryptedData.data);
    });

    toUpdate.forEach((element: any) => indexesArray.push(element.index))
  }

  if (toDelete.data.length) {
    dataArray.push(...toDelete.data);
    indexesArray.push(...toDelete.index)
  }

  const collectedData = {
    data: dataArray,
    indexes: indexesArray,
  }

  return collectedData;
}

const sortNewAndOldData = (localData: any, contractData: any) => {
  const oldData: any[] = [];
  const newData: any[] = [];

  if (!contractData ) {
    localData.forEach((localElement: any) => {
      newData.push({
        data: convertToContractDataMapperV1(localElement),
        index: -1
      });
    });
  } else {
    contractData.forEach((contractMember: any, i: number) => {
      const isMemberExist = localData.find((localMember: any) => contractMember.id === localMember.id);
      if (isMemberExist) {
        const isMemberShouldUpdate = checkDataToUpdate(isMemberExist, contractMember);
        
        if (isMemberShouldUpdate) {
          const convetedData = convertToContractDataMapperV1(isMemberExist);
          oldData.push({data: convetedData, index: i});
        }

        return;
      }

      return;
    });

    localData.forEach((localMember: any) => {
      const isMemberDoesntExistInContract = contractData.find((contractMember: any) => localMember.id === contractMember.id);

      if (!isMemberDoesntExistInContract) {
        newData.push({
          data: convertToContractDataMapperV1(localMember),
          index: -1
        })
      }
    });
  }

  return {
    oldData,
    newData
  }
};

const toDelete = (arrayFromContract: any[], address: `0x${string}`) => {
  const objectToPush: DeleteInterface = {
    iv: [],
    index: [],
    data: []
  }
  const userData = localStorage.getItem(`${address}`);
  
  if (userData) {

    const deletedList = JSON.parse(userData).deletedList;

    if (!deletedList || !deletedList.length) {
      return objectToPush;
    }
  
    if (!arrayFromContract) {
      return objectToPush;
    }

    deletedList.forEach((id: number) => {
      const index = arrayFromContract.findIndex((elementInContract) => elementInContract.id === id);

      if (index !== -1) {
        objectToPush.iv.push(0);
        objectToPush.data.push("0x");
        objectToPush.index.push(index);
      }

      return;
    })

    return objectToPush;
  } else {
    console.error("Try to delete failed: User data does not exist");
  }
}

const checkDataToUpdate = (localMember: any, contractMember: any) => {
  for (let key in contractMember) {
    if (!isEqual(contractMember[key], localMember[key])) {
      // console.log("differences", key, contractMember[key], localMember[key]); // for debugging

      return true;
      
    }
  };

  return false;
};

export {
  collectDataToPush,
  sortNewAndOldData,
  toDelete
};
