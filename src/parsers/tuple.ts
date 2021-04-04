import { DecodeFunction, EncodeFunction } from '../types';
import { getParser, pack, unpack } from './array';

const TUPLE_REGEX = /^\((.*)\)$/;

/**
 * Check if a type is an tuple type.
 *
 * @param {string} type
 * @return {boolean}
 */
export const isTuple = (type: string): boolean => {
  return TUPLE_REGEX.test(type);
};

export const getTypes = (type: string): string[] => {
  return type
    .slice(1, -1)
    .split(',')
    .map((type) => type.trim());
};

export const isDynamicTuple = (types: string[]): boolean => {
  return types.map(getParser).some((parser) => parser.dynamic);
};

export const encodeTuple: EncodeFunction<unknown[]> = (
  buffer: Uint8Array,
  values: unknown[],
  type: string
): Uint8Array => {
  if (!isTuple(type)) {
    throw new Error('Invalid type: type is not tuple');
  }

  const types = getTypes(type);
  return pack(buffer, values, types);
};

export const decodeTuple: DecodeFunction<unknown[]> = (value: Uint8Array, _: Uint8Array, type: string): unknown[] => {
  if (!isTuple(type)) {
    throw new Error('Invalid type: type is not tuple');
  }

  const types = getTypes(type);
  return unpack(value, types);
};
