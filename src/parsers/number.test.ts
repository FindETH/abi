import { fromHex, toHex } from '../utils';
import { number } from './number';

describe('number', () => {
  describe('encode', () => {
    it('encodes a unsigned number', () => {
      expect(toHex(number.encode({ type: 'uint256', value: 314159n, buffer: new Uint8Array() }))).toBe(
        '000000000000000000000000000000000000000000000000000000000004cb2f'
      );
      expect(toHex(number.encode({ type: 'uint256', value: 314159, buffer: new Uint8Array() }))).toBe(
        '000000000000000000000000000000000000000000000000000000000004cb2f'
      );
      expect(toHex(number.encode({ type: 'uint256', value: '314159', buffer: new Uint8Array() }))).toBe(
        '000000000000000000000000000000000000000000000000000000000004cb2f'
      );
      expect(toHex(number.encode({ type: 'uint256', value: '0x314159', buffer: new Uint8Array() }))).toBe(
        '0000000000000000000000000000000000000000000000000000000000314159'
      );
    });

    it('encodes a signed number', () => {
      expect(toHex(number.encode({ type: 'int256', value: -314159n, buffer: new Uint8Array() }))).toBe(
        'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb34d1'
      );
      expect(toHex(number.encode({ type: 'int256', value: -314159, buffer: new Uint8Array() }))).toBe(
        'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb34d1'
      );
      expect(toHex(number.encode({ type: 'int256', value: '-314159', buffer: new Uint8Array() }))).toBe(
        'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb34d1'
      );
    });
  });

  describe('decode', () => {
    it('decodes an encoded unsigned number', () => {
      const value = fromHex('000000000000000000000000000000000000000000000000000000000004cb2f');
      expect(number.decode({ type: 'uint256', value, skip: jest.fn() })).toBe(314159n);
    });

    it('decodes an encoded signed number', () => {
      const value = fromHex('000000000000000000000000000000000000000000000000000000000004cb2f');
      expect(number.decode({ type: 'int256', value, skip: jest.fn() })).toBe(314159n);

      const negativeValue = fromHex('fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb34d1');
      expect(number.decode({ type: 'int256', value: negativeValue, skip: jest.fn() })).toBe(-314159n);
    });
  });
});
