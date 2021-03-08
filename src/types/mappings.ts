import type { decodeAddress, encodeAddress } from '../parsers/address';
import type { decodeBoolean, encodeBoolean } from '../parsers/boolean';
import type { decodeBytes, encodeBytes } from '../parsers/bytes';
import type { decodeFunction, encodeFunction } from '../parsers/function';
import type { decodeNumber, encodeNumber } from '../parsers/number';
import type { decodeString, encodeString } from '../parsers/string';
import type { DecodeFunction, EncodeFunction } from './parser';

// prettier-ignore
type ByteLength = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32;
// prettier-ignore
type IntegerLength = 8 | 16 | 24 | 32 | 40 | 48 | 56 | 64 | 72 | 80 | 88 | 96 | 104 | 112 | 120 | 128 | 136 | 144 | 152 | 160 | 168 | 176 | 184 | 192 | 200 | 208 | 216 | 224 | 232 | 240 | 248 | 256;

type Bytes = `bytes${ByteLength}`;
type Integer = `int${IntegerLength}`;
type UnsignedInteger = `uint${IntegerLength}`;

export type Type = keyof OutputTypeMap;
export type TypeMapper<I extends any[], T = OutputTypeMap> = Mapper<T, I>;

/**
 * An object type with most possible ABI types, and their respective TypeScript type. Note that some dynamic types, like
 * `<type>[<length>]` and `fixed<M>x<N>` are not supported, and `unknown` is used instead.
 */
export type OutputTypeMap = WithArrayTypes<
  GenericTypeMap<
    typeof decodeAddress,
    typeof decodeBoolean,
    typeof decodeBytes,
    typeof decodeFunction,
    typeof decodeNumber,
    typeof decodeString
  >
>;

/**
 * An object type with most possible ABI types, and their respective TypeScript type. Note that some dynamic types, like
 * `<type>[<length>]` and `fixed<M>x<N>` are not supported, and `unknown` is used instead.
 *
 * Accepts multiple input types for certain ABI types, like strings, bytes, numbers.
 */
export type InputTypeMap = WithArrayTypes<
  GenericTypeMap<
    typeof encodeAddress,
    typeof encodeBoolean,
    typeof encodeBytes,
    typeof encodeFunction,
    typeof encodeNumber,
    typeof encodeString
  >
>;

/**
 * Generic type map which is used to generate the input and output type map.
 */
type GenericTypeMap<
  AddressFunction,
  BooleanFunction,
  BytesFunction,
  FunctionFunction,
  NumberFunction,
  StringFunction
> = {
  address: ExtractGeneric<AddressFunction>;
  bool: ExtractGeneric<BooleanFunction>;
  bytes: ExtractGeneric<BytesFunction>;
  function: ExtractGeneric<FunctionFunction>;
  int: ExtractGeneric<NumberFunction>;
  string: ExtractGeneric<StringFunction>;
  uint: ExtractGeneric<NumberFunction>;
} & DynamicType<Bytes, ExtractGeneric<BytesFunction>> &
  DynamicType<Integer, ExtractGeneric<NumberFunction>> &
  DynamicType<UnsignedInteger, ExtractGeneric<NumberFunction>>;

/**
 * Helper type to generate an object type from a union.
 */
type DynamicType<K extends string, T> = {
  [key in K]: T;
};

/**
 * Helper type that maps the input `I` to the types `T`.
 */
type Mapper<T, I extends any[]> = {
  [K in keyof I]: I[K] extends I[number] ? T[I[K]] : unknown;
};

/**
 * Helper type that adds an array type for each of the specified keys and types.
 */
type WithArrayTypes<T> = T &
  {
    [K in keyof T as `${string & K}[]`]: Array<T[K]>;
  };

/**
 * Helper type that extracts the input or output from an EncodeFunction or DecodeFunction.
 */
type ExtractGeneric<T> = T extends DecodeFunction<infer O> ? O : T extends EncodeFunction<infer I> ? I : never;
