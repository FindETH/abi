import { pack, unpack } from './packer';
import { InputTypeMap, Narrow, Type, TypeMapper } from './types';

/**
 * Encode the data with the provided types.
 */
export const encode = <T extends Array<Type | string>>(
  types: Narrow<T>,
  values: TypeMapper<T, InputTypeMap>
): Uint8Array => {
  return pack(types, values, new Uint8Array());
};

/**
 * Decode the buffer with the specified types.
 *
 * @param types The types to decode the buffer with.
 * @param buffer The buffer to decode.
 * @return The decoded values as array.
 */
export const decode = <T extends Array<Type | string>>(types: Narrow<T>, buffer: Uint8Array): TypeMapper<T> => {
  return unpack(types, buffer) as TypeMapper<T>;
};
