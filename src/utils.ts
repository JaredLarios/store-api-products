import { v4 as uuidv4 } from "uuid";

export const generateUuid = (): string => uuidv4().toString();
export const generateDate = (): Date => new Date();

export const getEnumKeyByEnumValue = (
  enumObj: { [key: string]: unknown },
  value: string,
): string | undefined => {
  return Object.keys(enumObj).find(
    (key) => enumObj[key as keyof typeof enumObj] === value,
  );
};

//TODO: Add validation that all query params are on spot.
export const validateMissingParams = (
  queries: { [key: string]: any },
  ignore: string[] | undefined,
): Array<string> => {
  return Object.keys(queries).filter(
    (key) => !queries[key] && !ignore?.includes(key),
  );
};

export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};
