export const fromTwosComplement = (buffer: Uint8Array): bigint => {
  let value = 0n;
  for (const byte of buffer) {
    value = (value << 8n) + BigInt(byte);
  }

  return BigInt.asIntN(buffer.length * 8, value);
};

export const toTwosComplement = (value: bigint, length: number): Uint8Array => {
  const buffer = new Uint8Array(length);
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = Number(BigInt.asUintN(8, value));
    value = value >> 8n;
  }

  return buffer.reverse();
};
