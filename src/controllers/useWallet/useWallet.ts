import React, { Dispatch, SetStateAction } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useDisconnect,
  useAccountEffect,
  useBalance,
  useChainId
} from "wagmi";

import { WriteContractErrorType } from "wagmi/actions";
import { BaseError } from 'viem';
import { toast } from "react-toastify";

import {
  encrypt,
  decrypt,
  bigIntToUint8Array,
  compressHex,
  decompressHex,
  convertToLocalDataMapperV1,
  fliterDataBeforeConvertV1, 
  deriveKeyArgon,
  hexStringToUint8Array,
  Uint8ArrayToBigInt,
  uint8ArraytoHexString
} from "../../utils";

import { contractABI, contractAddress, commission } from "../abi";
import { usePassword } from "../usePassword/usePassword";

import { collectDataToPush, sortNewAndOldData, toDelete } from "./sortingUtils";


export interface UseWalletReturnInterface {
  readContract: () => Promise<unknown>;
  sendTx: () => Promise<void>;
  disconnectWallet: () => void;
  checkPasswordIsCorrect: (password: string) => Promise<boolean>;
  wipeContractData: (
    onModalClose: React.Dispatch<React.SetStateAction<boolean>>,
    clearLocalCache: () => void
  ) => void;
  pending: {
    dataPending: boolean;
    datePending: boolean;
  },
  error: WriteContractErrorType | null;
  isLoading: boolean;
  isConnected: boolean;
  userAddress: `0x${string}` | undefined
}


export const useWallet = (setLocalCacheChanged?: Dispatch<SetStateAction<boolean>>): UseWalletReturnInterface => {
  const { getPassword } = usePassword();

  const { address, isConnected } = useAccount();
  const { writeContract, error } = useWriteContract();
  useAccountEffect({
    onDisconnect: () => {
      sessionStorage.clear();
      localStorage.removeItem("encrypted");
    }
  });

  const chainId = useChainId();
  const balance = useBalance({ address, chainId });

  const { data: compressedData, isPending: dataPending, isLoading } = useReadContract({
    abi: contractABI,
    address: contractAddress,
    functionName: "getData",
    args: [`${address}` as `0x${string}`]
  });

  const { data: contractUpdatedAt, isPending: datePending } = useReadContract({
    abi: contractABI,
    address: contractAddress,
    functionName: "getUpdatedAt",
    args: [`${address}`  as `0x${string}`],
  });

  const { disconnect } = useDisconnect();

  const decryptData = async (data: string[]) => {
    if (data && data.length !== 0) {
      const decryptedArray = [];

      for (let i = 0; i < data.length; i++ ) {
        console.log("data " + data[i]);

        const bytes = hexStringToUint8Array(data[i].slice(2))
        const iv = bytes.slice(0, 12)
        console.log("iv " + uint8ArraytoHexString(iv));

        const dataFromContract = "0x" + data[i].slice(26);
        console.log("encrypted data " + dataFromContract);

        // decompress if iv == 0, decrypt if iv != 0
        if (uint8ArraytoHexString(iv) === "000000000000") {
          const decompressedData = decompressHex(dataFromContract);

          decryptedArray.push(decompressedData);
        } else {
          const password = getPassword();

          const key = await getKey(iv, password);
          const decryptedData = await decrypt(key, iv, dataFromContract);

          decryptedArray.push(decryptedData);
        }
      }

      return decryptedArray;
    }
    
    return;
  }

  const readContract = async () => {
    try {
      const data = await decryptData(compressedData as string[]);
      const contractDataUpdatedAt = Number(contractUpdatedAt) * 1000;
      const localValue = localStorage.getItem(`${address}`);

      const filtredData = data?.filter(fliterDataBeforeConvertV1);
      const convertedData = filtredData?.map((item: any) => convertToLocalDataMapperV1(item));

      if (!localValue) {
        localStorage.setItem(
          `${address}`,
          JSON.stringify({
            contractData: convertedData,
            data: convertedData,
            deletedList: [],
            timeStamp: Date.now()
          })
        )
      } else {
        const parsedLocalValue = JSON.parse(localValue).timeStamp;

        if (parsedLocalValue <= contractDataUpdatedAt) {
          localStorage.setItem(
            `${address}`,
            JSON.stringify({
              contractData: convertedData,
              data: convertedData,
              deletedList: [],
              timeStamp: contractDataUpdatedAt
            })
          );

          return convertedData;
        }
      }

      return convertedData;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  const checkPasswordIsCorrect = async (password: string) => {
    try {

      if (!compressedData) {
        return false;
      }

      for (let i = 0; i < compressedData.length; i++ ) {
        console.log("data " + compressedData[i]);

        const bytes = hexStringToUint8Array(compressedData[i].slice(2))
        const iv = bytes.slice(0, 12)
        console.log("iv " + uint8ArraytoHexString(iv));

        const dataFromContract = "0x" + compressedData[i].slice(26);
        console.log("encrypted data " + dataFromContract);

        const key = await getKey(iv, password);
        const decryptedData = await decrypt(key, iv, dataFromContract);

        if (!decryptedData) {
          return false;
        }
      }

      return true;
    } catch(err: any) {
      console.error("Error checking password:", err.message);
      return false;
    }
  }

  const getKey = async (iv: Uint8Array, password: string) => {
    const key = await deriveKeyArgon(password, iv);
  
    return key;
  }

  const runEncryption = async (data: Record<string, any>) => {
    try {
      const encryptedArray = await Promise.all(data.map(async (element: Record<string, any>) => {
        const password = getPassword();

        if (!password || password === "") {
          return {
            data: "0x000000000000000000000000" + compressHex(element)
          }
        } else {
          const iv = window.crypto.getRandomValues(new Uint8Array(12));
          const key = await getKey(iv, password);
        
          const encryptedElement = await encrypt(key, iv, element);
          return encryptedElement
        }
      })) 
      
      return encryptedArray;
    } catch (error) {
      console.error('Encryption failed:', error);
      throw error;
    }
  }

  const encryptData = async (dataToEncrypt: Record<string, any>) => {
    try {
      const dataToPush = await runEncryption(dataToEncrypt);

      return dataToPush;
    } catch(error) {
      console.error('Encryption data failed:', error);
      throw error;
    }
  }

  const sendTx = async () => {
    const localData = localStorage.getItem(`${address}`);

    if (!localData) {
      return;
    }

    const parsedData = (JSON.parse(localData)).data;

    if (!parsedData) {
      return;
    }

    try {
      const decrypdetArray = await readContract();

      // @ts-ignore
      const shouldDelete = toDelete(decrypdetArray, address);
      const sortedData = sortNewAndOldData(parsedData, decrypdetArray);

      const { data, indexes } = await collectDataToPush(sortedData.newData, sortedData.oldData, shouldDelete, encryptData);

      writeContract(
        {
          abi: contractABI,
          address: contractAddress,
          functionName: "bulkSave",
          args: [indexes, data],
          value: BigInt(commission)
        },
        {
          onSuccess: () => {
            clearDeleteList();
            toast.success("Transaction submitted successfully");
            setIndication();
            readContract();
          },
          onError: (err) => {
            console.error(err.message);
            toast.error("Failed to send the transaction");
            return new Error(err.message);
          }
        }
      );
    } catch (error) {
      console.error("Fail to send transaction", error)
      throw error
    }
  }

  const setIndication = () => {
    if (setLocalCacheChanged) {
      setLocalCacheChanged(false);
    }
  }

  const clearDeleteList = () => {
    const userData = localStorage.getItem(`${address}`);

    if (!userData) {
      console.error("Fail to clear delete list: User data is not exist.");
    } else {
      const parsedUserData = JSON.parse(userData);

      localStorage.setItem(`${address}`, JSON.stringify({
        data: parsedUserData.data,
        contractData: parsedUserData.contractData,
        deletedList: [],
        timeStamp: parsedUserData.timeStamp
      }));
    };
  };

  const wipeContractData = (onModalClose: React.Dispatch<React.SetStateAction<boolean>>, clearLocalCache: () => void) => {
    writeContract(
      {
        abi: contractABI,
        address: contractAddress,
        functionName: "wipe",
      },
      {
        onSuccess: () => {
          toast.warning("Your contract data was successfully wiped");
          onModalClose(false);
          clearLocalCache();
          setIndication();
        }
      }
    );
  };

  const disconnectWallet = () => {
    disconnect();
  };

  return {
    userAddress: address,
    readContract,
    sendTx,
    error,
    wipeContractData,
    disconnectWallet,
    checkPasswordIsCorrect,
    pending: {
      dataPending,
      datePending
    },
    isLoading,
    isConnected
  }
}