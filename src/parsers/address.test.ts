import { fromHex, toHex } from '../utils';
import { decodeAddress, encodeAddress } from './address';

describe('encodeAddress', () => {
  it('encodes an address', () => {
    expect(toHex(encodeAddress(new Uint8Array(0), '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520', 'address'))).toBe(
      '0000000000000000000000004bbeeb066ed09b7aed07bf39eee0460dfa261520'
    );
  });
});

describe('decodeAddress', () => {
  it('encodes an address', () => {
    const buffer = fromHex('0000000000000000000000004bbeeb066ed09b7aed07bf39eee0460dfa261520');
    expect(decodeAddress(buffer, buffer, 'address')).toBe('0x4bbeeb066ed09b7aed07bf39eee0460dfa261520');
  });
});
