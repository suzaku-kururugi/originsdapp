import { Crop } from "react-image-crop";
import type { LocalData, ContractData } from "./types";
import { Validate, composeValidators, Validators } from "./validators/validators";
import { AnyObject } from "final-form";
import * as argon2 from "argon2-browser";
import pako from "pako";

export const formatBalance = (rawBalance: string) => {
  const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(8);

  return balance;
}

export const formatChainAsNum = (chainIdHex: string) => {
  const chainIdNum = parseInt(chainIdHex);

  return chainIdNum;
}

export const parseHex = (hex: string) => {
  const byteString = Buffer.from(hex.slice(2), 'hex');
  const jsonData = JSON.parse(byteString.toString('utf-8'));

  return jsonData;
}

//** Deprecated */
export const convertToHex = (obj: Record<string, any>) => {
  const jsonString = JSON.stringify(obj);
  const byteString = Buffer.from(jsonString, 'utf-8');
  const hexString = "0x" + byteString.toString('hex');
  
  return hexString;
}

export function bigIntToUint8Array(num: bigint, length: number) {
  const byteArray = new Uint8Array(length);
    
  // Iterate over each byte from least significant to most significant
  for (let i = byteArray.length - 1; i >= 0; i--) {
      byteArray[i] = Number(num & BigInt(0xFF));
      num >>= BigInt(8);
  }
  
  return byteArray;
}

export function bigntToHex(value: bigint): string {
  if (value < 0n) {
    throw new Error("Negative bigint not supported");
  }
  return "0x" + value.toString(16);
}

export function Uint8ArrayToBigInt(byteArray: Uint8Array) {
  let bigInt = BigInt(0);
  for (let i = 0; i < byteArray.length; i++) {
      bigInt = (bigInt << BigInt(8)) | BigInt(byteArray[i]);
  }
  return bigInt;
}

export const encrypt = async (key: CryptoKey, iv: Uint8Array, obj: Record<string, any>) => {
  const compressedData = pako.deflate(JSON.stringify(obj));
  
  const encryptedData = await window.crypto.subtle.encrypt(
      {
          name: "AES-GCM",
          iv: iv,
      },
      key,
      compressedData
  );

  console.log("encrypt iv " + uint8ArraytoHexString(iv));
  console.log("encrypt data " + uint8ArraytoHexString(new Uint8Array(encryptedData)));
  
  return {
      data: '0x' + uint8ArraytoHexString(iv) + uint8ArraytoHexString(new Uint8Array(encryptedData))
  };
}

export const decrypt = async (key: CryptoKey, iv: Uint8Array, encryptedHex: string) => {
  try {
    const encryptedData = hexStringToUint8Array(encryptedHex.slice(2));
    const decryptedData = await window.crypto.subtle.decrypt(
      {
          name: "AES-GCM",
          iv: iv,
      },
      key,
      encryptedData
    );

    const decompressed = pako.inflate(decryptedData);
    const decoder = new TextDecoder();

    return JSON.parse(decoder.decode(decompressed));
  } catch (err) {
    throw new Error("Wrong password");
  }
}

export const deriveKeyArgon = async (password: string, iv: Uint8Array) => {
  // Derive the key using Argon2
  const argon2Result = await argon2.hash({
    pass: password,
    salt: iv, 
    time: 3,
    mem: 32768,
    hashLen: 32,
    type: argon2.ArgonType.Argon2id,
  });

  // Convert the derived key (Uint8Array) to a CryptoKey for AES-GCM
  const key = await crypto.subtle.importKey(
    "raw",
    argon2Result.hash, // Argon2-derived key
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );

  return key;
}

export const deriveKey = async (password: string, iv: Uint8Array) => {
  const encoder = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
  );

  const iterations = 1000000;
  const keyLength = 256;

  const key = await crypto.subtle.deriveKey(
      {
          name: "PBKDF2",
          salt: iv,
          iterations: iterations,
          hash: "SHA-256"
      },
      baseKey,
      { name: "AES-GCM", length: keyLength },
      true,
      ["encrypt", "decrypt"]
  );

  return key;
}

export const compressHex = (obj: Record<string, any>) => {
  const jsonString = JSON.stringify(obj);
  const compressedString = uint8ArraytoHexString(pako.deflate(jsonString));

  return compressedString;
}

export const generatePasssword = (
  length: number = 50,
  characters: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
): string => {
  return Array.from(crypto.getRandomValues(new Uint32Array(length)))
    .map((x) => characters[x % characters.length])
    .join('');
}

export const decompressHex = (hex: string) => {
  const byteArray = hexStringToUint8Array(hex.slice(2));
  try {
    const decompressedArray = pako.inflate(byteArray);
    const decoder = new TextDecoder('utf-8');
    
    const decodedString = decoder.decode(decompressedArray);
  
    return JSON.parse(decodedString);
  } catch (err: any) {
    throw new Error(err);
  }
}


export function uint8ArraytoHexString(byteArray: Uint8Array): string {
  return Array.from(byteArray, byte => {
    // Convert each byte to a two-digit hexadecimal string
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');
}

export function hexStringToUint8Array(hexString: string): Uint8Array {
  if (hexString.length % 2 !== 0) {
    throw new Error("Hex string must have an even number of characters");
  }

  const numBytes = hexString.length / 2;
  const byteArray = new Uint8Array(numBytes);

  for (let i = 0, j = 0; i < numBytes; i++, j += 2) {
    byteArray[i] = parseInt(hexString.slice(j, j + 2), 16);
  }

  return byteArray;
}

// old
// export const familyMemberMapper = (obj: Record<string, any>) => {
//   const contractData = {} as ContractData;
//   const parents = obj.parents.map((item: any) => item.id);
//   const prartners = obj.partners ? obj.partners.map((item: any) => item.id) : [];
//   const id = generateUniqueId();
//   const name = obj.fullName;

//   Object.assign(contractData, {
//     id,
//     bd: dateToTimestamp(obj.dateOfBirth),
//     dd: obj.dateOfDeath ? dateToTimestamp(obj.dateOfDeath) : "",
//     d: obj.biography || "",
//     n: name,
//     p: parents,
//     ps: prartners,
//     label: name,
//     value: id
//   });

//   return contractData;
// }

export const addFamilyMemberMapper = (obj: Record<string, any>) => {
  const familyMember = {} as LocalData;
  const parents = obj.parents.map((item: any) => item.id);
  const partners = obj.partners ? obj.partners.map((item: any) => item.id) : [];
  const avatarParams = {};

  if (obj.avatarParams) {
    Object.assign(avatarParams, obj.avatarParams);
  }
  // const photoUrls = obj.photoUrl.map((item: any) => item.id);
  const id = generateUniqueId();

  Object.assign(familyMember, {
    id,
    name: obj.fullName,
    dateOfBirth: dateToTimestamp(obj.dateOfBirth),
    dateOfDeath: obj.dateOfDeath ? dateToTimestamp(obj.dateOfDeath) : "",
    biography: obj.biography || "",
    photoUrl: [obj.photoUrl],
    avatarParams,
    parents,
    partners,
    x: 100,
    y: 100
  });

  return familyMember;
}

export const updateFamilyMemberMapper = (obj: Record<string, any>) => {
  const familyMember = {} as LocalData;
  const parents = obj.parents.map((item: any) => item.id);
  const partners = obj.partners ? obj.partners.map((item: any) => item.id) : [];
  const avatarParams = {};

  if (obj.avatarParams) {
    Object.assign(avatarParams, obj.avatarParams);
  }

  Object.assign(familyMember, {
    id: obj.id,
    name: obj.fullName,
    dateOfBirth: dateToTimestamp(obj.dateOfBirth),
    dateOfDeath: obj.dateOfDeath ? dateToTimestamp(obj.dateOfDeath) : "",
    photoUrl: [obj.photoUrl],
    biography: obj.biography || "",
    avatarParams,
    parents,
    partners,
  });

  return familyMember;
}

export const updateFormMapper = (obj: Record<string, any>, familyArray: LocalData[]) => {
  const formValues = {};

  const parents = obj.parents.map((parentId: number) => {
    const parent = familyArray.find(member => member.id === parentId);
    
    return {
      ...parent,
      label: parent?.name,
      value: parent?.id,
    }
  });

  const partners = obj.partners.map((partnerId: number) => {
    const partner = familyArray.find(member => member.id === partnerId);

    return {
      ...partner,
      label: partner?.name,
      value: partner?.id
    }
  })

  if (obj.avatarParams) {
    Object.assign(formValues, {
      avatarParams: obj.avatarParams
    });
  }

  Object.assign(formValues, {
    id: obj.id,
    fullName: obj.name,
    dateOfBirth: new Date(obj.dateOfBirth),
    dateOfDeath: obj.dateOfDeath ? new Date(obj.dateOfDeath) : "",
    biography: obj.biography,
    photoUrl: obj.photoUrl[0] ? obj.photoUrl[0] : "",
    parents,
    partners
  });

  return formValues;
}

export const convertToContractDataMapperV1 = (obj: Record<string, any>) => {
  const contractData = {} as ContractData;

  if (obj.avatarParams) {
    Object.assign(contractData, { ap: JSON.stringify(obj.avatarParams) });
  }

  Object.assign(contractData, {
    id: obj.id,
    bd: obj.dateOfBirth,
    dd: obj.dateOfDeath,
    d: obj.biography,
    n: obj.name,
    p: obj.parents,
    ps: obj.partners,
    u: obj.photoUrl,
    x: obj.x,
    y: obj.y,
    v: 1
  });

  return contractData;
}

export const convertToLocalDataMapperV1 = (obj: Record<string, any>) => {
  const localData = {} as LocalData;

  if (obj.ap) {
    Object.assign(localData, { avatarParams: JSON.parse(obj.ap) })
  }

  Object.assign(localData, {
    id: obj.id,
    dateOfBirth: obj.bd,
    dateOfDeath: obj.dd,
    biography: obj.d,
    name: obj.n,
    parents: obj.p,
    partners: obj.ps,
    photoUrl: obj.u ? obj.u : [],
    x: obj.x,
    y: obj.y,
    v: 1
  });

  return localData;
}

import {
  isIdValid,
  isNameValid,
  isDescriptionValid,
  isDateValid,
  isIDsArrayValid,
  isPhotoUrlValid,
  isAvatarParamsValid
} from "./validators/contractDataValidator";

export const fliterDataBeforeConvertV1 = (obj: Record<string, any>) => {
  const validators = [
    isIdValid(obj.id),
    isNameValid(obj.n),
    isDescriptionValid(obj.d),
    isDateValid(obj.bd, "Birthday"),
    isDateValid(obj.dd, "Day of death"),
    isIDsArrayValid(obj.p, "Parents"),
    isIDsArrayValid(obj.p, "Partners"),
    isPhotoUrlValid(obj.u),
    isAvatarParamsValid(JSON.parse(obj.ap))
  ];

  const conditions = validators.every(validator => validator === true);
  return conditions;
}

export const dateToTimestamp = (date: string) => {
  const timestamp = (new Date(date)).getTime();

  return timestamp;
}

function generateUniqueId() {
  const randomTwoDigitNumber = Math.floor(Math.random() * 100);
  const timestamp = Date.now();

  const uniqueId = Number(timestamp + randomTwoDigitNumber.toString());

  return uniqueId;
}

export const getFieldValidators = (validate?: Validate, values?: AnyObject) => {
  if (!validate) {
    return undefined;
  }

  if (typeof validate === "string") {
    if (!Validators[validate]) {
      throw new Error("Validator does not exist");
    }

    return Validators[validate];
  }

  const validatorFunctions: any = validate.map((rule) => {
    if (typeof rule === "string") {
      return Validators[rule];
    }

    const [ruleName, ...ruleArguments] = rule;

    if (!Validators[ruleName]) {
      throw new Error(`Validator rule ${ruleName} does not exist`);
    }

    const validatorProps = ruleArguments.concat([values]);

    // @ts-ignore
    return Validators[ruleName](...validatorProps);
  });

  return composeValidators(...validatorFunctions);
};

export const getCroppedImg = (image: HTMLImageElement, crop: Crop): string => {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width!;
  canvas.height = crop.height!;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.drawImage(
    image,
    crop.x! * scaleX,
    crop.y! * scaleY,
    crop.width! * scaleX,
    crop.height! * scaleY,
    0,
    0,
    crop.width!,
    crop.height!
  );

  // Return Data URL directly
  return canvas.toDataURL('image/jpeg');
};

export const getCroppedImgFromUrl = async (imageUrl: string, crop: Crop, width: number, height: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous"; 
    image.src = imageUrl;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / width;
      const scaleY = image.naturalHeight / height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      resolve(canvas.toDataURL('image/jpeg'));
    };

    image.onerror = () => {
      console.warn(`Image at ${imageUrl} failed to load. Loading default image.`);
      image.src = "/avatar_default.png";

      image.onload = () => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / width;
        const scaleY = image.naturalHeight / height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height
        );

        resolve(canvas.toDataURL('image/jpeg'));
      };

      image.onerror = () => {
        reject(new Error(`Failed to load both primary and default images.`));
      };
    };
  });
};

export type { Validate };
