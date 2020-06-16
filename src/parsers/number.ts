import { concat, toBuffer, toNumber } from '../utils/buffer';
import { fromTwosComplement, toTwosComplement } from '../utils/twos-complement';
import { DecodeFunction, EncodeFunction } from './parser';

const NUMBER_REGEX = /^u?int([0-9]*)?$/;

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

export const encodeNumber: EncodeFunction = (buffer: Buffer, value: bigint, type: string): Buffer => {
  if (!inRange(value, type)) {
    throw new Error(`Cannot encode number: value is out of range for type ${type}`);
  }

  if (isSigned(type)) {
    return concat(buffer, toTwosComplement(value, 32));
  }

  return concat(buffer, toBuffer(value));
};

export const decodeNumber: DecodeFunction = (value: Buffer, _, type: string): bigint => {
  if (isSigned(type)) {
    return fromTwosComplement(value);
  }

  return toNumber(value);
};
