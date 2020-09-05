import { toString } from '../utils/buffer';
import { decodeBytes, encodeBytes } from './bytes';
import { DecodeFunction, EncodeFunction } from './parser';

export const encodeString: EncodeFunction = (buffer: Uint8Array, value: string): Uint8Array => {
  const bufferValue = Buffer.from(value, 'utf8');

  return encodeBytes(buffer, bufferValue, 'bytes');
};

export const decodeString: DecodeFunction = (value: Uint8Array): string => {
  return toString(decodeBytes(value, Buffer.alloc(0), 'bytes'));
};
