import { concat, toBuffer, toNumber } from '../utils/buffer';
import { decodeAddress, encodeAddress } from './address';
import { decodeNumber, encodeNumber, isNumber } from './number';
import { DecodeFunction, EncodeFunction, Parser } from './parser';
import { decodeFixedBytes, encodeFixedBytes, isFixedBytes } from './fixed-bytes';

const ARRAY_REGEX = /^(.*)\[]$/;

/**
 * Check if a type is an array type.
 *
 * @param {string} type
 * @return {boolean}
 */
export const isArray = (type: string): boolean => {
  return ARRAY_REGEX.test(type);
};

/**
 * Get the "inner" type for an array type. E.g. `getType("uint256[]")` -> uint256.
 *
 * @param {string} type
 * @return {string}
 */
const getType = (type: string): string => {
  return type.match(ARRAY_REGEX)![1];
};

export const encodeArray: EncodeFunction = (buffer: Buffer, values: unknown[], type: string): Buffer => {
  const actualType = getType(type);
  const length = toBuffer(values.length);

  const arrayBuffer = concat(buffer, length);

  return pack(arrayBuffer, values, new Array(values.length).fill(actualType));
};

export const decodeArray: DecodeFunction = (value: Buffer, buffer: Buffer, type: string): unknown[] => {
  const actualType = getType(type);
  const pointer = Number(toNumber(value));
  const length = Number(toNumber(buffer.subarray(pointer, pointer + 32)));

  const arrayPointer = pointer + 32;
  const arrayBuffer = buffer.subarray(arrayPointer);

  return unpack(arrayBuffer, new Array(length).fill(actualType));
};

/**
 * All available parsers.
 */
const parsers: Record<string, Parser> = {
  address: {
    encode: encodeAddress,
    decode: decodeAddress
  },
  array: {
    dynamic: true,
    encode: encodeArray,
    decode: decodeArray
  },
  fixedBytes: {
    encode: encodeFixedBytes,
    decode: decodeFixedBytes
  },
  number: {
    encode: encodeNumber,
    decode: decodeNumber
  }
};

/**
 * Get a parser for a type. Throws an error if the parser could not be found.
 *
 * @param {string} type
 * @return {Parser}
 */
export const getParser = (type: string): Parser => {
  if (parsers[type]) {
    return parsers[type];
  }

  // bytes[n]
  if (isFixedBytes(type)) {
    return parsers.fixedBytes;
  }

  // u?int[n]
  if (isNumber(type)) {
    return parsers.number;
  }

  // type[]
  if (isArray(type)) {
    return parsers.array;
  }

  throw new Error(`type "${type}" is not supported`);
};

interface PackState {
  staticBuffer: Buffer;
  dynamicBuffer: Buffer;
  updateFunctions: ((buffer: Buffer) => Buffer)[];
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
export const pack = (buffer: Buffer, values: unknown[], types: string[]): Buffer => {
  const {
    staticBuffer: packedStaticBuffer,
    dynamicBuffer: packedDynamicBuffer,
    updateFunctions: packedUpdateFunctions
  } = types.reduce<PackState>(
    ({ staticBuffer, dynamicBuffer, updateFunctions }, type, index) => {
      const parser = getParser(type);
      const value = values[index];

      if (parser.dynamic) {
        const offset = dynamicBuffer.length;
        const staticOffset = staticBuffer.length;

        const newStaticBuffer = concat(staticBuffer, Buffer.alloc(32, 0));
        const newDynamicBuffer = parser.encode(dynamicBuffer, value, type);

        const update = (oldBuffer: Buffer): Buffer => {
          return Buffer.concat([
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
    { staticBuffer: Buffer.alloc(0), dynamicBuffer: Buffer.alloc(0), updateFunctions: [] }
  );

  const updatedStaticBuffer = packedUpdateFunctions.reduce<Buffer>(
    (target, update) => update(target),
    packedStaticBuffer
  );

  return Buffer.concat([buffer, updatedStaticBuffer, packedDynamicBuffer]);
};

/**
 * Iterate over a `Buffer` with provided `chunkSize`.
 *
 * @param {Buffer} buffer
 * @param {number} chunkSize
 * @return {Generator<Buffer, Buffer, void>}
 */
export function* iterate(buffer: Buffer, chunkSize: number): Generator<Buffer, Buffer, void> {
  for (let i = 0; i < buffer.length; i += chunkSize) {
    yield buffer.slice(i, i + chunkSize);
  }

  return buffer;
}

export const unpack = (buffer: Buffer, types: string[]): unknown[] => {
  const iterator = iterate(buffer, 32);

  return types.map((type) => {
    const { value, done } = iterator.next();
    if (done) {
      throw new Error('input data has an invalid length');
    }

    const parser = getParser(type);
    return parser.decode(value, buffer, type);
  });
};
