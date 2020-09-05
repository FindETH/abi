const BUFFER_WIDTH = 32;

export const concat = (target: Uint8Array, value: Uint8Array, position?: number): Uint8Array => {
  return new Uint8Array([
    ...target.subarray(0, position ?? target.length),
    ...value,
    ...target.subarray(position ?? target.length)
  ]);
};

export const toBuffer = (value: number | bigint): Uint8Array => {
  const hex = value.toString(16);
  return Buffer.from(hex.padStart(BUFFER_WIDTH * 2, '0').slice(0, BUFFER_WIDTH * 2), 'hex');
};

export const toNumber = (buffer: Uint8Array): bigint => {
  const hex = toHex(buffer);
  if (hex.length === 0) {
    return BigInt(0);
  }

  return BigInt(`0x${hex}`);
};

const numberToHex = (value: number): string => {
  return ('0' + value.toString(16)).slice(-2);
};

export const toHex = (buffer: Uint8Array): string => {
  return Array.from(buffer).map(numberToHex).join('');
};
