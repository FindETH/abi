import { toBigIntBE, toBufferBE } from 'bigint-buffer';
import { concat } from '../buffer';
import { DecodeFunction, EncodeFunction } from '../contract';

const NUMBER_REGEX = /u?int([0-9]*)?/;

const isSigned = (type: string): boolean => {
  return type.startsWith('i');
};

export const isNumber = (type: string): boolean => {
  return NUMBER_REGEX.test(type);
};

export const getBitLength = (type: string): number => {
  const rawBits = type.match(NUMBER_REGEX)?.[1] ?? '256';
  return Number(rawBits);
};

export const inRange = (value: bigint, type: string): boolean => {
  const bits = BigInt(getBitLength(type));

  if (isSigned(type)) {
    const maxSignedValue = 2n ** (bits - 1n) - 1n;
    return value >= -maxSignedValue - 1n && value <= maxSignedValue;
  }

  const maxValue = 2n ** bits - 1n;
  return value >= 0 && value <= maxValue;
};

const fromTwosComplement = (buffer: Buffer): bigint => {
  let value = 0n;
  for (const byte of buffer) {
    // tslint:disable-next-line:no-bitwise
    value = (value << 8n) + BigInt(byte);
  }

  return BigInt.asIntN(buffer.length * 8, value);
};

export const decodeNumber: DecodeFunction<bigint> = (value, _, type): bigint => {
  if (isSigned(type)) {
    return fromTwosComplement(value);
  }

  return toBigIntBE(value);
};

const toTwosComplement = (value: bigint, length: number): Buffer => {
  const buffer = Buffer.alloc(length);
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = Number(BigInt.asUintN(8, value));
    // tslint:disable-next-line:no-bitwise
    value = value >> 8n;
  }

  return buffer.reverse();
};

export const encodeNumber: EncodeFunction<bigint> = (target, data, position, type): Buffer => {
  if (!inRange(data, type)) {
    throw new Error(`Cannot encode number: value is out of range for type ${type}`);
  }

  if (isSigned(type)) {
    return concat(target, toTwosComplement(data, 32), position);
  }

  const numberBuffer = toBufferBE(data, 32);
  return concat(target, numberBuffer, position);
};
