import { concat } from '../utils/buffer';
import { DecodeFunction, EncodeFunction } from './parser';

export const encodeAddress: EncodeFunction = (buffer: Buffer, value: string): Buffer => {
  const addressBuffer = Buffer.alloc(32);
  addressBuffer.write(value.substring(2), 12, 'hex');

  return concat(buffer, addressBuffer);
};

export const decodeAddress: DecodeFunction = (value: Buffer): string => {
  const addressBuffer = value.subarray(-20);
  return `0x${addressBuffer.toString('hex')}`;
};
