import { decodeAddress, encodeAddress } from './address';

describe('decodeAddress', () => {
  it('decodes an address', () => {
    const buffer = Buffer.from('0000000000000000000000006b175474e89094c44da98b954eedeac495271d0f', 'hex');
    expect(decodeAddress(buffer, buffer, 'address')).toBe('0x6b175474e89094c44da98b954eedeac495271d0f');
  });
});

describe('encodeAddress', () => {
  it('encodes an address', () => {
    const target = Buffer.alloc(0);
    const address = '0x6b175474e89094c44da98b954eedeac495271d0f';

    expect(encodeAddress(target, address, 0, 'address').toString('hex')).toBe(
      '0000000000000000000000006b175474e89094c44da98b954eedeac495271d0f'
    );
  });
});
