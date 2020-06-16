import { toBigIntBE, toBufferBE } from 'bigint-buffer';

export const concat = (target: Buffer, value: Buffer, position?: number): Buffer => {
  return Buffer.concat([
    target.subarray(0, position ?? target.length),
    value,
    target.subarray(position ?? target.length)
  ]);
};

export const toBuffer = (value: number | bigint): Buffer => {
  return toBufferBE(BigInt(value), 32);
};

export const toNumber = (buffer: Buffer): bigint => {
  return toBigIntBE(buffer);
};
