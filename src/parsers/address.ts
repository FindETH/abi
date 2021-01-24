import { concat, fromHex, stripPrefix, toHex } from '../utils';
import { DecodeFunction, EncodeFunction } from './parser';

export const encodeAddress: EncodeFunction = (buffer: Uint8Array, value: string): Uint8Array => {
  if (value.length !== 42) {
    throw new Error('Invalid address length');
  }

  const addressBuffer = fromHex(stripPrefix(value).padStart(64, '0'));

  return concat([buffer, addressBuffer]);
};

export const decodeAddress: DecodeFunction = (value: Uint8Array): string => {
  const addressBuffer = value.subarray(-20);
  return `0x${toHex(addressBuffer)}`;
};
