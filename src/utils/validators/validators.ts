interface ErrorResult {
  code: number | string;
  props?: { [key: string]: string | number | Date } | { intl: { [key: string]: string } };
}

export const composeValidators =
  (...validators: Function[]) =>
  (value: any) =>
    validators.reduce((errors: unknown[] | undefined, validator: Function) => {
      const validatedValue = validator(value);
      return validatedValue ? [...(errors || []), validatedValue] : errors;
    }, undefined);

const error = (
  code: number | string,
  props?: { [key: string]: string | number | Date } | { intl: { [key: string]: string } }
): ErrorResult => ({ code, ...props });


//** Validators */
export const required = (value?: any) => {
  const errorMessage = "This field is required";

  if (typeof value === "boolean") {
    return value ? undefined : error(errorMessage);
  }

  if (Array.isArray(value)) {
    return value && value.length ? undefined : error(errorMessage);
  }

  return value !== undefined && value?.toString()?.trim() ? undefined : error(errorMessage);
};

export const maxValue = (max: number | Date, errorCode?: string) => (value?: number | Date) => {
    if (!value) {
      return undefined;
    }

    return value <= max ? undefined : error(`Maximum value for this field is: ${max}`);
  };

export const minValue = (min: number | Date) => (value?: number | Date) => {
  if (!value) {
    return undefined;
  }
  return value >= min ? undefined : error(`Minimum value for this field is: ${min}`);
};

export const maxLength = (length: number) => (value?: any) => {
  if (!value) {
    return undefined;
  }
  return value.length <= length
    ? undefined
    : error(`Maximum length for this field is: ${length}`);
};

export const minLength = (length: number) => (value?: any) => {
  if (!value) {
    return undefined;
  }
  return value.trim().length >= length
    ? undefined
    : error(`Minimum length for this field is: ${length}`);
};

export const requiredLatinOnly = (value?: any) => {
  if (!value) {
    return undefined;
  }
  return /^[a-zA-Z\-\'\s]+$/.test(value)
    ? undefined
    : error("Use only latin symbols");
};

export const passwordRequiredSymbolsOnly = (value?: any) => {
  if (!value) {
    return undefined;
  }

  const regex = /^[0-9A-Za-z~!@#$%^&*\-]+$/;

  return regex.test(value)
    ? undefined
    : error("Allowed symbols: latin letters, numbers, ~!@#$%^&*");
}

export const urlRequiredSymbolsOnly = (value?: any) => {
  if (!value) {
    return undefined;
  }

  const regex = /^[A-Za-z0-9\-._~:/?#\[\]@!$&'()*+,;=]+$/;

  return regex.test(value)
    ? undefined
    : error("Allowed symbols: latin letters, numbers, -._~:/?#[]@!$&'()*+,;=");
}

export const nameAndDescriptionSymbols = (value?: any) => {
  if (!value) {
    return undefined;
  }

  const regex = /^[\p{L}'`\-\s]+$/u;

  return regex.test(value)
    ? undefined
    : error("Allowed symbols: letters from all languages, spaces, hyphens, and apostrophes.");
}

export const descriptionSymbols = (value?: any) => {
  if (!value) {
    return undefined;
  }

  const regex = /^(?:[\p{L}'\-\s.,0-9;:"^&*#@!()?]+|)$/u;

  return regex.test(value)
    ? undefined
    : error("Allowed symbols: letters from all languages and special symbols (-._~:/?#[]@!&'*+,)");
}

export const urlShouldStartFromHTTPS = (value?: any) => {
  if (!value) {
    return undefined;
  }

  const regex = /^https:\/\/.+$/;

  return regex.test(value)
    ? undefined
    : error("URL should start with 'https://'");
}

export const Validators = {
  required,
  maxValue,
  minValue,
  maxLength,
  minLength,
  requiredLatinOnly,
  descriptionSymbols,
  passwordRequiredSymbolsOnly,
  urlRequiredSymbolsOnly,
  nameAndDescriptionSymbols,
  urlShouldStartFromHTTPS
};

type ValidatorKeys = keyof typeof Validators;

export type Validate = Array<ValidatorKeys | [ValidatorKeys, ...any[]]>;
