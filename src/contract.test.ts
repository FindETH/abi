import miscAbi from './__fixtures__/misc.json';
import { parseType } from './contract';
import { ContractFunction } from './types';

const misc = miscAbi as ContractFunction[];

describe('parseTypes', () => {
  it('parses a regular type to a string', () => {
    expect(parseType(misc[0].inputs[0])).toBe('address');
    expect(parseType(misc[0].inputs[1])).toBe('uint256');
  });

  it('parses a tuple type to a string', () => {
    expect(parseType(misc[0].inputs[2])).toBe('(address,uint256)');
    expect(parseType(misc[0].inputs[3])).toBe('(address,(address,uint256))');
  });
});
