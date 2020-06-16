const BUFFER_WIDTH = 32;

export const concat = (target: Buffer, value: Buffer, position?: number): Buffer => {
  return Buffer.concat([
    target.subarray(0, position ?? target.length),
    value,
    target.subarray(position ?? target.length)
  ]);
};

export const toBuffer = (value: number | bigint): Buffer => {
  const hex = value.toString(16);
  return Buffer.from(hex.padStart(BUFFER_WIDTH * 2, '0').slice(0, BUFFER_WIDTH * 2), 'hex');
};

export const toNumber = (buffer: Buffer): bigint => {
  const hex = buffer.toString('hex');
  if (hex.length === 0) {
    return BigInt(0);
  }

  return BigInt(`0x${hex}`);
};
