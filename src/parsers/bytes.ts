import { addPadding, concat, toBuffer, toNumber } from '../utils/buffer';
import { DecodeFunction, EncodeFunction } from './parser';

export const encodeBytes: EncodeFunction = (buffer: Uint8Array, value: string | Uint8Array): Uint8Array => {
  const bufferValue = toBuffer(value);

  const paddedSize = Math.ceil(bufferValue.byteLength / 32) * 32;

  return concat(buffer, Buffer.concat([toBuffer(bufferValue.byteLength), addPadding(bufferValue, paddedSize)]));
};

export const decodeBytes: DecodeFunction = (value: Uint8Array): Uint8Array => {
  const length = toNumber(value.subarray(0, 32));

  return value.subarray(32, 32 + Number(length));
};
