import { toHex } from '../utils';
import { encodeString } from './string';

describe('encodeString', () => {
  it('encodes a string to a buffer', () => {
    expect(
      toHex(encodeString(new Uint8Array(0), 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', 'bytes'))
    ).toBe(
      '00000000000000000000000000000000000000000000000000000000000000374c6f72656d20697073756d20646f6c6f722073697420616d65742c20636f6e73656374657475722061646970697363696e6720656c6974000000000000000000'
    );
  });
});

// TODO
/*describe('decodeString', () => {
  it('decodes a byte array to a buffer', () => {
    const buffer = Buffer.from(
      '00000000000000000000000000000000000000000000000000000000000000374c6f72656d20697073756d20646f6c6f722073697420616d65742c20636f6e73656374657475722061646970697363696e6720656c6974000000000000000000',
      'hex'
    );
    expect(decodeString(buffer, new Uint8Array(0), 'bytes')).toBe(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
    );
  });
});*/
