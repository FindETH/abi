import { decode, decodeWithIdentifier, encode, encodeWithIdentifier } from './abi';
import { ContractFunction, ContractInterface } from './contract';
import erc20 from './__tests__/erc20.json';

const erc20Interface = erc20 as ContractInterface[];
const transferInterface = erc20[7] as ContractFunction;

describe('decode', () => {
  it('decodes a token transfer', () => {
    const buffer = Buffer.from(
      '0000000000000000000000006b175474e89094c44da98b954eedeac495271d0f0000000000000000000000000000000000000000000000000000000000003039',
      'hex'
    );
    expect(decode(transferInterface.inputs, buffer)).toStrictEqual([
      '0x6b175474e89094c44da98b954eedeac495271d0f',
      12345n
    ]);
  });
});

describe('decodeWithIdentifier', () => {
  it('decodes a token transfer', () => {
    const buffer = Buffer.from('a9059cbb0000000000000000000000006b175474e89094c44da98b954eedeac495271d0f0000000000000000000000000000000000000000000000000000000000003039', 'hex');
    expect(decodeWithIdentifier(erc20Interface, buffer)).toStrictEqual([
      '0x6b175474e89094c44da98b954eedeac495271d0f',
      12345n
    ]);
  });
})

describe('encode', () => {
  it('encodes a token transfer', () => {
    expect(
      encode(transferInterface.inputs, ['0x6b175474e89094c44da98b954eedeac495271d0f', 12345n]).toString('hex')
    ).toStrictEqual(
      '0000000000000000000000006b175474e89094c44da98b954eedeac495271d0f0000000000000000000000000000000000000000000000000000000000003039'
    );
  });
});

describe('encodeWithIdentifier', () => {
  it('encodes a token transfer with identifier', () => {
    expect(
      encodeWithIdentifier(transferInterface, ['0x6b175474e89094c44da98b954eedeac495271d0f', 12345n]).toString('hex')
    ).toStrictEqual(
      'a9059cbb0000000000000000000000006b175474e89094c44da98b954eedeac495271d0f0000000000000000000000000000000000000000000000000000000000003039'
    );
  });
});
