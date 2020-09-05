import { toBuffer } from '../utils/buffer';
import { asBuffer } from './fixed-bytes';
import { DecodeFunction, EncodeFunction } from './parser';

export const encodeBytes: EncodeFunction = (_: Uint8Array, value: string | Uint8Array): Uint8Array => {
  const bufferValue = asBuffer(value);
  const paddedSize = Math.ceil(bufferValue.byteLength / 32) * 32;

  return Buffer.concat([
    toBuffer(bufferValue.byteLength),
    bufferValue,
    Buffer.alloc(paddedSize - bufferValue.byteLength, 0)
  ]);
};

export const decodeBytes: DecodeFunction = (value: Uint8Array): Uint8Array => {
  // TODO
  return value;
};
