import { pack, unpack } from './parsers/array';
import { Type, TypeMapper } from './types';

/**
 * Encode the data with the provided types.
 */
export const encode = <T extends Readonly<Array<Type | string>>>(types: T, values: TypeMapper<T>): Uint8Array => {
  return pack(new Uint8Array(0), values, types);
};

/**
 * Decode the data with the provided types.
 */
export const decode = <T extends Readonly<Array<Type | string>>>(types: T, buffer: Uint8Array): TypeMapper<T> => {
  return unpack(buffer, types) as TypeMapper<T>;
};
