import { BooleanInput, DecodeFunction, EncodeFunction } from '../types';
import { decodeNumber, encodeNumber } from './number';

const getBooleanValue = (value: BooleanInput): boolean => {
  if (typeof value === 'string') {
    return value === 'true' || value === 'yes';
  }

  return value;
};

export const encodeBoolean: EncodeFunction<BooleanInput> = (buffer: Uint8Array, value: BooleanInput): Uint8Array => {
  return encodeNumber(buffer, getBooleanValue(value) ? 1 : 0, 'uint256');
};

export const decodeBoolean: DecodeFunction<boolean> = (value: Uint8Array, buffer: Uint8Array): boolean => {
  return decodeNumber(value, buffer, 'uint256') === 1n;
};
