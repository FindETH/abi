import { DecodeFunction, EncodeFunction } from '../contract';
import { decodeArray, encodeArray } from './array';

// TODO: Check how Solidity encodes strings
export const decodeString: DecodeFunction<string> = (value, data): string => {
  const array = decodeArray(value, data, 'bytes[]') as Buffer[];

  return array.map((buffer) => buffer.toString('utf8')).join('');
};

// TODO: Check how Solidity encodes strings
export const encodeString: EncodeFunction<string> = (target, data, position): Buffer => {
  const stringBuffer = Buffer.from(data, 'utf8');

  const items = new Array<undefined>(Math.ceil(stringBuffer.length / 32))
    .fill(undefined)
    .map((_, index) => index * 32)
    .map((itemPointer) => {
      return stringBuffer.subarray(itemPointer, itemPointer + 32);
    });

  return encodeArray(target, items, position, 'bytes[]');
};
