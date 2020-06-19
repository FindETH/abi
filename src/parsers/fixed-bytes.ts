import { concat } from '../utils/buffer';
import { DecodeFunction, EncodeFunction } from './parser';

const BYTES_PADDING = Buffer.alloc(32, 0);
const BYTES_REGEX = /^bytes([0-9]{1,2})$/;

export const isFixedBytes = (type: string): boolean => {
  return BYTES_REGEX.test(type);
};

export const getByteLength = (type: string): number | undefined => {
  const bytes = type.match(BYTES_REGEX)?.[1];

  if (bytes) {
    return Number(bytes);
  }
};

export const encodeFixedBytes: EncodeFunction = (buffer: Buffer, value: Buffer, type: string): Buffer => {
  const length = getByteLength(type);
  if (length) {
    // Length is 0 < n <= 32
    const paddedValue = concat(value, BYTES_PADDING.subarray(value.length));
    return concat(buffer, paddedValue);
  }

  throw new Error('Invalid type: no length');
};

export const decodeFixedBytes: DecodeFunction = (value: Buffer): Buffer => {
  return value;
};
