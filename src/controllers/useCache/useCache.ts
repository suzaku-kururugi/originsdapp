import { useState, type Dispatch, type SetStateAction } from "react";
import { addFamilyMemberMapper, updateFamilyMemberMapper } from "../../utils";

import { LocalData } from "../../utils/types";
import { toast } from "react-toastify";

import {
  compareArraysLength,
  compareObjectsIds,
  compareObjectKeysAndValues,
} from "./utils";


interface UseCacheArgs {
  setUpdate: Dispatch<SetStateAction<boolean>>;
  setModalActive?: Dispatch<SetStateAction<boolean>>;
  setEditModalActive?: Dispatch<SetStateAction<boolean>>;
  setLocalCacheChanged: Dispatch<SetStateAction<boolean>>;
  userAddress: `0x${string}` | undefined;
}

interface UseCacheReturnData {
  addFamilyMember: (json: Record<string, any>, form: any) => void;
  updateFamilyMember: (json: Record<string, any>, form: any) => void;
  deleteFamilyMember: (event: any) => void;
  isLocalDataMatchToContract: () => boolean | "error";
  resetDataToContractValue: () => void;
  clearLocalCache: () => void;
}

export const useCache = (args: UseCacheArgs): UseCacheReturnData => {
  const { setModalActive, setUpdate, setEditModalActive, setLocalCacheChanged, userAddress } = args;

  const updateCacheData = (memberData: LocalData, form: any) => {
    let updatedArray = [];
    let contractDataForCompare: LocalData[] = [];
    let deletedList: number[] = [];
    const localData = localStorage.getItem(`${userAddress}`);

    if (!localData) {

      updatedArray.push(memberData);
    } else {
      const parsedData = JSON.parse(localData).data;
      contractDataForCompare = JSON.parse(localData).contractData || [];
      deletedList = JSON.parse(localData).deletedList || [];

      if (parsedData) {
        const isElementExist = parsedData.find((element: LocalData) => element.id === memberData.id);

        if (!isElementExist) {
          parsedData.push(memberData);
  
          updatedArray = parsedData;
        } else {
          const elementIndex = parsedData.findIndex((element: LocalData) => element.id === memberData.id);
          parsedData[elementIndex] = {
            ...memberData,
            x: parsedData[elementIndex].x, 
            y: parsedData[elementIndex].y
          };
  
          updatedArray = parsedData;
        }
      } else {
        updatedArray.push(memberData);
      }
    }

    localStorage.setItem(`${userAddress}`, JSON.stringify({
      deletedList,
      contractData: contractDataForCompare,
      data: updatedArray,
      timeStamp: Date.now()
    }));

    isLocalDataMatchToContract();
    setUpdate(true)
    // form.reset(); Probably it should be removed in next time
  }

  const addFamilyMember = (values: Record<string, any>, form: any) => {
    const preparedMemberData = addFamilyMemberMapper(values);

    if (!setModalActive) {
      throw new Error("setModalActive function is not defined")
    }
    setModalActive(false);
    updateCacheData(preparedMemberData, form);
    toast.success("Member successfully added");
  }

  const updateFamilyMember = (values: Record<string, any>, form: any) => {
    const preparedMemberData = updateFamilyMemberMapper(values);

    if (!setEditModalActive) {
      throw new Error("setModalActive function is not defined")
    }

    setEditModalActive(false);
    updateCacheData(preparedMemberData, form);
    toast.success("Member successfully edited");
  }

  const deleteFamilyMember = (id: number) => {
    const localData = localStorage.getItem(`${userAddress}`);

    if (!localData) {
      throw new Error("where is my data ?")
    } else {
      const parsedData = JSON.parse(localData);
      const localFamilyArray = parsedData.data;
      const elementIndex = localFamilyArray.findIndex((element: any) => element.id === id);

      if (elementIndex === -1) {
        return;
      }

      const deletedList = addMemberIdToDeletedList(id);
      localFamilyArray.splice(elementIndex, 1);
      
      const clearedArray = clearLinksWhileDelete(localFamilyArray, id);

      localStorage.setItem(`${userAddress}`, JSON.stringify({
        contractData: parsedData.contractData,
        data: clearedArray,
        deletedList,
        timeStamp: Date.now()
      }));

      
      if (!setEditModalActive) {
        throw new Error("setModalActive function is not defined")
      }
      
      setUpdate(true);
      setEditModalActive(false);
      isLocalDataMatchToContract();
      toast.info("Member successfully deleted");
    }
  }

  const clearLinksWhileDelete = (localTreeArray: any[], id: number) => {
    const clearedArray = localTreeArray.map(node => {
      const parents = node.parents;
      const partners = node.partners;

      const clearedParrentsArray = checkLinks(parents, id);
      const clearedPartnersArray = checkLinks(partners, id);

      return {
        ...node,
        parents: clearedParrentsArray,
        partners: clearedPartnersArray
      };
    })

    return clearedArray;
  }

  const checkLinks = (array: number[], id: number) => {
    const indexOfLink = array.findIndex((linkId: number) => linkId === id);

    if (indexOfLink !== -1) {
      array.splice(indexOfLink, 1);
    }

    return array;
  }

  const addMemberIdToDeletedList = (elementId: number) => {
    let list: number[] = [];
  
    const userData = localStorage.getItem(`${userAddress}`);
  
    if (!userData) {
      console.error("Error while adding id to delete list: User data does not exist");
    } else {
      const fullData = JSON.parse(userData);
      const deletedList = fullData.deletedList || [];
  
      if (!deletedList.includes(elementId)) {
        deletedList.push(elementId);
      }
  
      list = deletedList;
    }
  
    return list;
  };


  const isLocalDataMatchToContract = (): boolean | "error" => {
    const localData = localStorage.getItem(`${userAddress}`);

    if (!localData) {
      console.error(`Error while comparing data: Local data does not exist`);

      return "error";
    } else {
      const currentData = JSON.parse(localData).data;
      const contractData = JSON.parse(localData).contractData;

      if (!currentData || !contractData) return false;

      if (compareArraysLength(contractData?.length, currentData?.length)) {
        const checksArray: boolean[] = [
          compareObjectsIds(contractData, currentData),
          compareObjectKeysAndValues(contractData, currentData)
        ]

        const conditions = checksArray.every(check => check === true);

        if (!conditions) {
          setLocalCacheChanged(true);
        } else {
          setLocalCacheChanged(false);
        }

        return conditions;
      } else {
        setLocalCacheChanged(true);
        return false;
      }
    }
  }

  const resetDataToContractValue = () => {
    const localData = localStorage.getItem(`${userAddress}`);

    if (!localData) {
      console.error("Nothing to reset");
    } else {
      const contractData = JSON.parse(localData).contractData;
 
      localStorage.setItem(`${userAddress}`, JSON.stringify({
        deletedList: [],
        contractData,
        data: contractData,
        timeStamp: Date.now()
      }));

      toast.info("Data was reset");
      isLocalDataMatchToContract();
      setUpdate(true);
    }
  }

  const clearLocalCache = () => {
    const localData = localStorage.getItem(`${userAddress}`);
 
    if (!localData) {
      console.error("Nothing to reset");
    } else {
      localStorage.setItem(`${userAddress}`, JSON.stringify({
        timeStamp: Date.now()
      }));

      setUpdate(true);
    }
  }

  return {
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
    isLocalDataMatchToContract,
    resetDataToContractValue,
    clearLocalCache
  }
}