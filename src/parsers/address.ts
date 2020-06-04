import { DecodeFunction, EncodeFunction } from '../contract';

export const decodeAddress: DecodeFunction<string> = (value): string => {
  const addressBuffer = value.subarray(-20);
  return `0x${addressBuffer.toString('hex')}`;
};

export const encodeAddress: EncodeFunction<string> = (target, data, position): Buffer => {
  const addressBuffer = Buffer.alloc(32);
  addressBuffer.write(data.substring(2), 12, 'hex');

  return Buffer.concat([target.slice(0, position), addressBuffer, target.subarray(position)]);
};
