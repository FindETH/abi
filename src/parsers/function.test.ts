import { fromHex, toHex } from '../utils';
import { decodeFunction, encodeFunction } from './function';

describe('encodeFunction', () => {
  it('encodes a function', () => {
    expect(
      toHex(encodeFunction(new Uint8Array(0), 'ec3f4f80aa317fe2f345fb30ad0745746fd3a44855721d61', 'function'))
    ).toBe('ec3f4f80aa317fe2f345fb30ad0745746fd3a44855721d610000000000000000');
  });
});

describe('decodeFunction', () => {
  it('encodes a function', () => {
    const buffer = fromHex('ec3f4f80aa317fe2f345fb30ad0745746fd3a44855721d610000000000000000');
    expect(toHex(decodeFunction(buffer, buffer, 'function'))).toBe('ec3f4f80aa317fe2f345fb30ad0745746fd3a44855721d61');
  });
});
