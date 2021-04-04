import { fromHex, toHex } from '../utils';
import { fn } from './function';

describe('function', () => {
  describe('encode', () => {
    it('encodes a function', () => {
      expect(
        toHex(
          fn.encode({
            type: 'function',
            value: '6b175474e89094c44da98b954eedeac495271d0f70a08231',
            buffer: new Uint8Array()
          })
        )
      ).toBe('6b175474e89094c44da98b954eedeac495271d0f70a082310000000000000000');

      expect(
        toHex(
          fn.encode({
            type: 'function',
            value: {
              address: '0x6b175474e89094c44da98b954eedeac495271d0f',
              selector: '70a08231'
            },
            buffer: new Uint8Array()
          })
        )
      ).toBe('6b175474e89094c44da98b954eedeac495271d0f70a082310000000000000000');
    });
  });

  describe('decode', () => {
    it('decodes an encoded function', () => {
      const value = fromHex('6b175474e89094c44da98b954eedeac495271d0f70a082310000000000000000');
      expect(fn.decode({ type: 'function', value, skip: jest.fn() })).toStrictEqual({
        address: '0x6b175474e89094c44da98b954eedeac495271d0f',
        selector: '70a08231'
      });
    });
  });
});
