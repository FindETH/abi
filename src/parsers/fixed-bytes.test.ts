import { fromHex, toHex } from '../utils';
import { decodeFixedBytes, encodeFixedBytes } from './fixed-bytes';

describe('encodeFixedBytes', () => {
  it('encodes a fixed byte array to a buffer', () => {
    expect(toHex(encodeFixedBytes(new Uint8Array(0), '0xf00f00', 'bytes32'))).toBe(
      'f00f000000000000000000000000000000000000000000000000000000000000'
    );
  });

  it('throws if the value is too long', () => {
    expect(() => encodeFixedBytes(new Uint8Array(0), '0xf00f00', 'bytes1')).toThrow();
  });
});

describe('decodeFixedBytes', () => {
  it('decodes a fixed byte array from a buffer', () => {
    const buffer = fromHex('f00f000000000000000000000000000000000000000000000000000000000000');
    expect(toHex(decodeFixedBytes(buffer, new Uint8Array(0), 'bytes1'))).toBe('f0');
    expect(toHex(decodeFixedBytes(buffer, new Uint8Array(0), 'bytes16'))).toBe('f00f0000000000000000000000000000');
    expect(toHex(decodeFixedBytes(buffer, new Uint8Array(0), 'bytes32'))).toBe(
      'f00f000000000000000000000000000000000000000000000000000000000000'
    );
  });
});
