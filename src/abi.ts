import { pack, unpack } from './parsers/array';
import { Type, TypeMapper, Narrow, InputTypeMap } from './types';

/**
 * Encode the data with the provided types.
 */
export const encode = <T extends Array<Type | string>>(
  types: Narrow<T>,
  values: TypeMapper<T, InputTypeMap>
): Uint8Array => {
  return pack(new Uint8Array(0), values, types);
};

/**
 * Decode the data with the provided types.
 */
export const decode = <T extends Array<Type | string>>(types: Narrow<T>, buffer: Uint8Array): TypeMapper<T> => {
  return unpack(buffer, types) as TypeMapper<T>;
};
