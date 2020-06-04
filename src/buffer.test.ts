import { concat } from './buffer';

describe('concat', () => {
  it('concatenates a Buffer in another Buffer at a specific position', () => {
    const target = Buffer.from('123456abcdef', 'hex');
    const buffer = Buffer.from('f00f00', 'hex');

    expect(concat(target, buffer, 3).toString('hex')).toBe('123456f00f00abcdef');
  });
});
