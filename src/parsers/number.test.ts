import { toHex } from '../utils';
import { encodeNumber } from './number';

describe('encodeNumber', () => {
  it('encodes a number', () => {
    expect(toHex(encodeNumber(new Uint8Array(0), 12345, 'uint256'))).toBe(
      '0000000000000000000000000000000000000000000000000000000000003039'
    );
    expect(toHex(encodeNumber(new Uint8Array(0), 12345, 'int256'))).toBe(
      '0000000000000000000000000000000000000000000000000000000000003039'
    );
    expect(toHex(encodeNumber(new Uint8Array(0), -12345, 'int256'))).toBe(
      'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffcfc7'
    );
  });

  it('encodes a bigint', () => {
    expect(toHex(encodeNumber(new Uint8Array(0), 12345n, 'uint256'))).toBe(
      '0000000000000000000000000000000000000000000000000000000000003039'
    );
    expect(toHex(encodeNumber(new Uint8Array(0), 12345n, 'int256'))).toBe(
      '0000000000000000000000000000000000000000000000000000000000003039'
    );
    expect(toHex(encodeNumber(new Uint8Array(0), -12345n, 'int256'))).toBe(
      'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffcfc7'
    );
  });

  it('encodes a string', () => {
    expect(toHex(encodeNumber(new Uint8Array(0), '12345', 'uint256'))).toBe(
      '0000000000000000000000000000000000000000000000000000000000003039'
    );
    expect(toHex(encodeNumber(new Uint8Array(0), '12345', 'int256'))).toBe(
      '0000000000000000000000000000000000000000000000000000000000003039'
    );
    expect(toHex(encodeNumber(new Uint8Array(0), '-12345', 'int256'))).toBe(
      'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffcfc7'
    );
  });
});
