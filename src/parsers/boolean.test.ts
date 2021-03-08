import { fromHex, toHex } from '../utils';
import { decodeBoolean, encodeBoolean } from './boolean';

describe('encodeBoolean', () => {
  it('encodes a boolean', () => {
    expect(toHex(encodeBoolean(new Uint8Array(0), true, 'bool'))).toBe(
      '0000000000000000000000000000000000000000000000000000000000000001'
    );
    expect(toHex(encodeBoolean(new Uint8Array(0), false, 'bool'))).toBe(
      '0000000000000000000000000000000000000000000000000000000000000000'
    );
  });

  it('encodes a string', () => {
    expect(toHex(encodeBoolean(new Uint8Array(0), 'true', 'bool'))).toBe(
      '0000000000000000000000000000000000000000000000000000000000000001'
    );
    expect(toHex(encodeBoolean(new Uint8Array(0), 'yes', 'bool'))).toBe(
      '0000000000000000000000000000000000000000000000000000000000000001'
    );
    expect(toHex(encodeBoolean(new Uint8Array(0), 'false', 'bool'))).toBe(
      '0000000000000000000000000000000000000000000000000000000000000000'
    );
    expect(toHex(encodeBoolean(new Uint8Array(0), 'foo bar', 'bool'))).toBe(
      '0000000000000000000000000000000000000000000000000000000000000000'
    );
  });
});

describe('decodeBoolean', () => {
  it('decodes a boolean', () => {
    const trueValue = fromHex('0000000000000000000000000000000000000000000000000000000000000001');
    expect(decodeBoolean(trueValue, trueValue, 'bool')).toBe(true);

    const falseValue = fromHex('0000000000000000000000000000000000000000000000000000000000000000');
    expect(decodeBoolean(falseValue, falseValue, 'bool')).toBe(false);
  });
});
