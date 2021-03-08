import { BytesInput } from '../types';
import { addPadding, concat, toBuffer, toNumber } from '../utils';
import { DecodeFunction, EncodeFunction } from './parser';

export const encodeBytes: EncodeFunction = (buffer: Uint8Array, value: BytesInput): Uint8Array => {
  const bufferValue = toBuffer(value);
  const paddedSize = Math.ceil(bufferValue.byteLength / 32) * 32;

  return concat([buffer, toBuffer(bufferValue.byteLength), addPadding(bufferValue, paddedSize)]);
};

// TODO: This may not work properly yet
export const decodeBytes: DecodeFunction = (value: Uint8Array, buffer: Uint8Array): Uint8Array => {
  const pointer = Number(toNumber(value.subarray(0, 32)));
  const length = Number(toNumber(buffer.subarray(pointer, pointer + 32)));

  return buffer.subarray(pointer + 32, pointer + 32 + Number(length));
};
