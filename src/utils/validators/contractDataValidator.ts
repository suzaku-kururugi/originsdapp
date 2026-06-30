
const stringContainScriptOrTags = (value: string) => {
  const regex = /(<.*?>|<script.*?>.*?<\/script>)/i;

  return regex.test(value);
}

const stringContainNotAllowedSymbols = (string: string, allowedSymbolsRegexp: RegExp) => {
  return !allowedSymbolsRegexp.test(string);
}

const errorMessage = "The node has been removed for reason:";


export const isIdValid = (id: number) => {
  if (typeof id !== "number") {
    console.error(`${errorMessage} ID should be a number`);

    return false;
  }

  return true;
};

export const isNameValid = (name: string) => {
  const regex = /^[\p{L}'`\-\s]+$/u;

  if (typeof name !== 'string') {
    console.error(`${errorMessage} Name should be a string.`);

    return false;
  }

  if (!name.length) {
    console.error(`${errorMessage} Name has not length.`);

    return false;
  }

  if (stringContainScriptOrTags(name)) {
    console.error(`${errorMessage} Name contained scripts or tags.`);

    return false;
  }

  if (stringContainNotAllowedSymbols(name, regex)) {
    console.error(`${errorMessage} Name contained not allowed symbols`);

    return false;
  }

  return true;
}

export const isDescriptionValid = (description: string) => {
  const regex = /^(?:[\p{L}'\-\s.,0-9;:"^&*#@!()?]+|)$/u;

  if (typeof description !== 'string') {
    console.error(`${errorMessage} Description should be a string.`);

    return false;
  } else {
    if (stringContainScriptOrTags(description)) {
      console.error(`${errorMessage} Description contained scripts or tags: ${description}`);
  
      return false;
    }
  
    if (stringContainNotAllowedSymbols(description, regex)) {
      console.error(`${errorMessage}  Description contained not allowed symbols: ${description}`);
  
      return false
    }
  
    return true;
  }
}

export const isDateValid = (date: string | number, fieldName: string) => {
  if (date === "") return true;

  if (typeof date === "number" && !isNaN(new Date(date).getTime())) return true;

  console.error(`${errorMessage} ${fieldName} is not valid`)
  return false;
}

export const isIDsArrayValid = (array: number[], fieldName: string) => {
  if (!Array.isArray(array)) {
    console.error(`${errorMessage} ${fieldName} should be array`);

    return false;
  }

  if (array.length) {
    if (!array.every(id => typeof id === "number")) {
      console.error(`${errorMessage} ${fieldName} has not valid ID`)

      return false
    }
  }

  return true
}

export const isPhotoUrlValid = (photoUrl: string[] | null[]) => {
  const regex = /^https:\/\/.+$/;

  if (!Array.isArray(photoUrl)) {
    console.error(`${errorMessage} should be array`);

    return false;
  }

  const photoUrlValue = photoUrl[0];
  if (photoUrlValue === null) return true;

  if (typeof photoUrlValue === "string") {
    if (photoUrlValue === "") return true;

    const urlStartsFromHTTPS = regex.test(photoUrlValue);

    if (!urlStartsFromHTTPS) {
      console.error(`${errorMessage} Photo url should start from https://`);

      return false;
    }
  } else {
    console.error(`${errorMessage} Photo URL should be a string or null`);

    return false;
  }

  return true;
}

interface Crop {
  x: number;
  y: number;
  width: number;
  height: number;
  unit: string;
}

export const isAvatarParamsValid = (params: Record<string, unknown>): boolean => {
  if (typeof params !== 'object' || params === null) {
    console.error("Avatar params should be an object");
    return false;
  }

  const allowedKeys: { [key: string]: string } = { width: 'number', height: 'number', crop: 'object' };
  const allowedCropKeys: { [key: string]: string } = { x: 'number', y: 'number', width: 'number', height: 'number', unit: 'string' };

  if (Object.keys(params).length === 0) return true;

  for (const key of Object.keys(allowedKeys)) {
    if (key in params) {
      if (typeof params[key] !== allowedKeys[key]) {
        console.error(`${key} should have type ${allowedKeys[key]}`);

        return false;
      }
    }
  }

  if (params.crop && typeof params.crop === 'object' && !Array.isArray(params.crop)) {
    for (const key in allowedCropKeys) {
      if (key in params.crop) {
        if (typeof (params.crop as any)[key] !== allowedCropKeys[key]) {
          console.error(`crop.${key} should have type ${allowedCropKeys[key]}`);
          return false;
        }
      } else {
        console.error(`Not enough key crop.${key}`);
        return false;
      }
    }
  } else if (params.crop) {
    console.error("crop should be an object");
    return false;
  }

  const extraKeys = Object.keys(params).filter(key => !(key in allowedKeys));
  if (extraKeys.length > 0) {
    console.error(`Extra keys on top level of avatar params: ${extraKeys.join(', ')}`);
    return false;
  }

  if (params.crop) {
    const extraCropKeys = Object.keys(params.crop).filter(key => !(key in allowedCropKeys));
    if (extraCropKeys.length > 0) {
      console.error(`Extra keys in avatar params crop: ${extraCropKeys.join(', ')}`);
      return false;
    }
  }

  return true;
};
