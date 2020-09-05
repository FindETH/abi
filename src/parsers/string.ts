import { encodeBytes } from './bytes';
import { DecodeFunction, EncodeFunction } from './parser';

export const encodeString: EncodeFunction = (buffer: Uint8Array, value: string): Uint8Array => {
  const bufferValue = Buffer.from(value, 'utf8');

  return encodeBytes(buffer, bufferValue, 'string');
};

export const decodeString: DecodeFunction = (value: Uint8Array): Uint8Array => {
  // TODO
  return value;
};
