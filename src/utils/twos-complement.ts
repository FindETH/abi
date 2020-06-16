export const fromTwosComplement = (buffer: Buffer): bigint => {
  let value = 0n;
  for (const byte of buffer) {
    // tslint:disable-next-line:no-bitwise
    value = (value << 8n) + BigInt(byte);
  }

  return BigInt.asIntN(buffer.length * 8, value);
};

export const toTwosComplement = (value: bigint, length: number): Buffer => {
  const buffer = Buffer.alloc(length);
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = Number(BigInt.asUintN(8, value));
    // tslint:disable-next-line:no-bitwise
    value = value >> 8n;
  }

  return buffer.reverse();
};
