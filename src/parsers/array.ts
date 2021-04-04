import { DecodeFunction, EncodeFunction } from '../types';
import { concat, toBuffer, toNumber } from '../utils';
import { decodeAddress, encodeAddress } from './address';
import { decodeBoolean, encodeBoolean } from './boolean';
import { decodeBytes, encodeBytes } from './bytes';
import { decodeFixedBytes, encodeFixedBytes, isFixedBytes } from './fixed-bytes';
import { decodeNumber, encodeNumber, isNumber } from './number';
import { decodeString, encodeString } from './string';

const ARRAY_REGEX = /^(.*)\[]$/;
const TUPLE_REGEX = /^\((.*)\)$/;

/**
 * Check if a type is an array type.
 *
 * @param {string} type
 * @return {boolean}
 */
export const isArray = (type: string): boolean => {
  return ARRAY_REGEX.test(type);
};

export const isTuple = (type: string): boolean => {
  return TUPLE_REGEX.test(type);
};

/**
 * Get the "inner" type for an array or tuple type. E.g. `getType("uint256[]")` -> ["uint256"].
 *
 * @param {string} type
 * @return {string}
 */
export const getType = (type: string): string[] => {
  if (!isArray(type) && isTuple(type)) {
    return type
      .slice(1, -1)
      .split(',')
      .map((type) => type.trim());
  }

  return [type.match(ARRAY_REGEX)![1]];
};

export const encodeArray: EncodeFunction<unknown[]> = (
  buffer: Uint8Array,
  values: unknown[],
  type: string
): Uint8Array => {
  if (!isArray(type) && !isTuple(type)) {
    throw new Error('Invalid type: type is not array');
  }

  const actualType = getType(type);

  if (isTuple(type)) {
    return pack(buffer, values, actualType);
  }

  const length = toBuffer(values.length);
  const arrayBuffer = concat([buffer, length]);

  return pack(arrayBuffer, values, new Array(values.length).fill(actualType[0]));
};

export const decodeArray: DecodeFunction<unknown[]> = (
  value: Uint8Array,
  buffer: Uint8Array,
  type: string
): unknown[] => {
  if (!isArray(type) && !isTuple(type)) {
    throw new Error('Invalid type: type is not array');
  }

  const actualType = getType(type);
  const pointer = Number(toNumber(value));

  if (isTuple(type)) {
    return unpack(value, actualType);
  }

  const length = Number(toNumber(buffer.subarray(pointer, pointer + 32)));

  const arrayPointer = pointer + 32;
  const arrayBuffer = buffer.subarray(arrayPointer);

  return unpack(arrayBuffer, new Array(length).fill(actualType[0]));
};

/**
 * All available parsers.
 */
const parsers = {
  address: {
    dynamic: false,
    encode: encodeAddress,
    decode: decodeAddress
  },
  array: {
    dynamic: true,
    encode: encodeArray,
    decode: decodeArray
  },
  tuple: {
    dynamic: false,
    encode: encodeArray,
    decode: decodeArray
  },
  bool: {
    dynamic: false,
    encode: encodeBoolean,
    decode: decodeBoolean
  },
  bytes: {
    dynamic: true,
    encode: encodeBytes,
    decode: decodeBytes
  },
  fixedBytes: {
    dynamic: false,
    encode: encodeFixedBytes,
    decode: decodeFixedBytes
  },
  number: {
    dynamic: false,
    encode: encodeNumber,
    decode: decodeNumber
  },
  string: {
    dynamic: true,
    encode: encodeString,
    decode: decodeString
  }
};

export type ParserType = keyof typeof parsers;

/**
 * Get a parser for a type. Throws an error if the parser could not be found.
 *
 * @param {string} type
 * @return {Parser}
 */
export const getParser = (type: string) => {
  if (parsers[type as ParserType]) {
    return parsers[type as ParserType];
  }

  // TODO: Figure out type issues

  // bytes[n]
  if (isFixedBytes(type)) {
    return parsers.fixedBytes;
  }

  // u?int[n], bool
  if (isNumber(type)) {
    return parsers.number;
  }

  // type[]
  if (isArray(type)) {
    return parsers.array;
  }

  // (type)
  if (isTuple(type)) {
    return parsers.tuple;
  }

  throw new Error(`type "${type}" is not supported`);
};

export type UpdateFunction = (buffer: Uint8Array) => Uint8Array;

interface PackState {
  staticBuffer: Uint8Array;
  dynamicBuffer: Uint8Array;
  updateFunctions: UpdateFunction[];
}

/**
 * Pack multiple values into a single Buffer, based on the provided types. Returns a new buffer with the
 * packed values.
 *
 * Based on the implementation of Ethers.js:
 * https://github.com/ethers-io/ethers.js/blob/fa87417e9416d99a37d9a2668a1e54feb7e342fc/packages/abi/src.ts/coders/array.ts
 *
 * @param {Buffer} buffer
 * @param {any[]} values
 * @param {string[]} types
 * @return {Buffer}
 */
export const pack = (buffer: Uint8Array, values: unknown[], types: string[]): Uint8Array => {
  const {
    staticBuffer: packedStaticBuffer,
    dynamicBuffer: packedDynamicBuffer,
    updateFunctions: packedUpdateFunctions
  } = types.reduce<PackState>(
    ({ staticBuffer, dynamicBuffer, updateFunctions }, type, index) => {
      const parser = getParser(type);
      // TODO: Solve type issue
      const value = values[index] as any;

      if (parser.dynamic) {
        const offset = dynamicBuffer.length;
        const staticOffset = staticBuffer.length;

        const newStaticBuffer = concat([staticBuffer, new Uint8Array(32).fill(0)]);
        const newDynamicBuffer = parser.encode(dynamicBuffer, value, type);

        const update = (oldBuffer: Uint8Array): Uint8Array => {
          return concat([
            oldBuffer.subarray(0, staticOffset),
            toBuffer(oldBuffer.length + offset),
            oldBuffer.subarray(staticOffset + 32)
          ]);
        };

        return {
          staticBuffer: newStaticBuffer,
          dynamicBuffer: newDynamicBuffer,
          updateFunctions: [...updateFunctions, update]
        };
      }

      const newBuffer = parser.encode(staticBuffer, value, type);

      return { staticBuffer: newBuffer, dynamicBuffer, updateFunctions };
    },
    { staticBuffer: new Uint8Array(0), dynamicBuffer: new Uint8Array(0), updateFunctions: [] }
  );

  const updatedStaticBuffer = packedUpdateFunctions.reduce<Uint8Array>(
    (target, update) => update(target),
    packedStaticBuffer
  );

  return concat([buffer, updatedStaticBuffer, packedDynamicBuffer]);
};

export const unpack = (buffer: Uint8Array, types: string[]): unknown[] => {
  let pointer = 0;
  return types.map((type) => {
    if (pointer >= buffer.length) {
      throw new Error('input data has an invalid length');
    }

    const parser = getParser(type);
    if (isTuple(type)) {
      const types = getType(type);
      const tupleLength = types.length * 32;

      const value = buffer.subarray(pointer, pointer + tupleLength);
      pointer += tupleLength;

      return parser.decode(value, buffer, type);
    }

    const value = buffer.subarray(pointer, pointer + 32);
    pointer += 32;

    return parser.decode(value, buffer, type);
  });
};
