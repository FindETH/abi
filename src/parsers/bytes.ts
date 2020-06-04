import { DecodeFunction, EncodeFunction } from '../contract';

export const decodeBytes: DecodeFunction<Buffer> = (value): Buffer => {
  return value;
};

export const encodeBytes: EncodeFunction<Buffer> = (target, data, position): Buffer => {
  if (data.length > 32) {
    throw new Error(`Cannot encode bytes: value is > 32 bytes`);
  }

  const emptyBuffer = Buffer.alloc(32 - data.byteLength);

  // TODO: Figure out if padding goes in front or at the end
  return Buffer.concat([target.slice(0, position), emptyBuffer, data, target.subarray(position)]);
};
