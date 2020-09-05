import { concat } from '../utils/buffer';
import { DecodeFunction, EncodeFunction } from './parser';

export const BYTES_PADDING = Buffer.alloc(32, 0);
const BYTES_REGEX = /^bytes([0-9]{1,2})$/;

export const isFixedBytes = (type: string): boolean => {
  return BYTES_REGEX.test(type);
};

export const getByteLength = (type: string): number | undefined => {
  const bytes = type.match(BYTES_REGEX)?.[1];

  if (bytes) {
    const length = Number(bytes);
    if (length <= 0 || length > 32) {
      throw new Error('Invalid bytes length');
    }

    return length;
  }
};

export const asBuffer = (value: string | Uint8Array): Uint8Array => {
  if (typeof value === 'string') {
    const stringValue = value.startsWith('0x') ? value.substring(2) : value;
    return Buffer.from(stringValue, 'hex');
  }

  return value;
};

export const encodeFixedBytes: EncodeFunction = (
  buffer: Uint8Array,
  value: string | Uint8Array,
  type: string
): Uint8Array => {
  const length = getByteLength(type);
  const bufferValue = asBuffer(value);

  if (length) {
    // Length is 0 < n <= 32
    const paddedValue = concat(bufferValue, BYTES_PADDING.subarray(bufferValue.length));
    return concat(buffer, paddedValue);
  }

  throw new Error('Invalid type: no length');
};

export const decodeFixedBytes: DecodeFunction = (value: Uint8Array): Uint8Array => {
  return value;
};
