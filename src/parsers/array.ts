import { toBigIntBE, toBufferBE } from 'bigint-buffer';
import { decodeValue, encodeValue } from '../abi';
import { DecodeFunction, EncodeFunction } from '../contract';

const ARRAY_REGEX = /(.*)\[]/;

const getType = (type: string): string => {
  return type.match(ARRAY_REGEX)![1];
};

export const isArray = (type: string): boolean => {
  return ARRAY_REGEX.test(type);
};

export const decodeArray: DecodeFunction<unknown[]> = (value: Buffer, data: Buffer, type: string): unknown[] => {
  const innerType = getType(type);
  const pointer = Number(toBigIntBE(value));
  const length = Number(toBigIntBE(data.subarray(pointer, pointer + 32)));

  return new Array<undefined>(length)
    .fill(undefined)
    .map((_, index) => index * 32 + 32)
    .map((itemPointer) => {
      const itemValue = data.subarray(pointer + itemPointer, pointer + itemPointer + 32);
      return decodeValue(itemValue, data, innerType);
    });
};

export const encodeArray: EncodeFunction<unknown[]> = (target, data, position, type): Buffer => {
  const innerType = getType(type);
  const pointer = toBufferBE(BigInt(target.length) + 32n, 32);
  const length = toBufferBE(BigInt(data.length), 32);

  const first = Buffer.concat([target.subarray(0, position), pointer, target.subarray(position), length]);
  const encodedData = data.map((item) => {
    // TODO: This currently doesn't work with nested array types
    const buffer = Buffer.alloc(0);
    return encodeValue(buffer, item, 0, innerType);
  });

  return Buffer.concat([first, ...encodedData]);
};
