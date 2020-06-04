import { ContractFunction, ContractInput, DecodeFunction, EncodeFunction, Type } from './contract';
import { getIdentifier } from './identifier';
import { decodeAddress, encodeAddress } from './parsers/address';
import { decodeArray, isArray } from './parsers/array';
import { decodeBytes, encodeBytes } from './parsers/bytes';
import { decodeNumber, encodeNumber, isNumber } from './parsers/number';
import { decodeString, encodeString } from './parsers/string';

// tslint:disable-next-line:no-any
export const PARSERS_BY_TYPE: { [key in Type]?: { decode: DecodeFunction<any>; encode: EncodeFunction<any> } } = {
  address: {
    encode: encodeAddress,
    decode: decodeAddress
  },
  bytes: {
    encode: encodeBytes,
    decode: decodeBytes
  },
  string: {
    encode: encodeString,
    decode: decodeString
  }
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

/**
 * Parse a raw value from a `Buffer`.
 *
 * @param {Buffer} value
 * @param {Buffer} data
 * @param {string} type
 * @return {unknown}
 */
export const decodeValue = (value: Buffer, data: Buffer, type: string): unknown => {
  const parser = PARSERS_BY_TYPE[type as Type];
  if (parser) {
    return parser.decode(value, data, type);
  }

  if (isNumber(type)) {
    return decodeNumber(value, data, type);
  }

  if (isArray(type)) {
    return decodeArray(value, data, type);
  }

  throw new Error(`Cannot parse value with type ${type}`);
};

/**
 * Decode an input data `Buffer` with provided types.
 *
 * @param {ContractInput[]} types
 * @param {Buffer} data
 * @return {unknown[]}
 */
export const decode = (types: ContractInput[], data: Buffer): unknown[] => {
  const iterator = iterate(data, 32);

  return types.map((input) => {
    const { value, done } = iterator.next();
    if (done) {
      throw new Error('Invalid input data: incorrect length');
    }

    return decodeValue(value, data, input.type);
  });
};

/**
 * Encode `value` to a Buffer, and return the new full input data `Buffer`.
 *
 * @param {Buffer} target
 * @param {any} value
 * @param {number} position
 * @param {string} type
 * @return {Buffer}
 */
export const encodeValue = (target: Buffer, value: unknown, position: number, type: string): Buffer => {
  const parser = PARSERS_BY_TYPE[type as Type];
  if (parser) {
    return parser.encode(target, value, position, type);
  }

  if (isNumber(type as Type)) {
    return encodeNumber(target, value as bigint, position, type);
  }

  return target;
};

/**
 * Encode the input data with the provided types.
 *
 * @param {ContractInput[]} types
 * @param {unknown[]} data
 * @return {Buffer}
 */
export const encode = (types: ContractInput[], data: unknown[]): Buffer => {
  return types.reduce<Buffer>((target, input, index) => {
    return encodeValue(target, data[index], index * 32, input.type);
  }, Buffer.alloc(0));
};

/**
 * Encode the input data with the provided function, and prepend the function identifier.
 *
 * @param {ContractFunction} contractFunction
 * @param {unknown[]} data
 * @return {Buffer}
 */
export const encodeWithIdentifier = (contractFunction: ContractFunction, data: unknown[]) => {
  const identifier = Buffer.from(getIdentifier(contractFunction), 'hex');
  const encoded = encode(contractFunction.inputs, data);

  return Buffer.concat([identifier, encoded]);
};
