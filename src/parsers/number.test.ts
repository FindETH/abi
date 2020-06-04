import { decodeNumber, encodeNumber } from './number';

describe('decodeNumber', () => {
  it('decodes a number', () => {
    const buffer = Buffer.from('0000000000000000000000000000000000000000000000000000000000003039', 'hex');

    expect(decodeNumber(buffer, buffer, 'uint')).toBe(12345n);
  });

  it('decodes a signed number', () => {
    const buffer = Buffer.from('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffcfc7', 'hex');
    const positiveBuffer = Buffer.from('0000000000000000000000000000000000000000000000000000000000003039', 'hex');

    expect(Number(decodeNumber(buffer, buffer, 'int'))).toBe(-12345);
    expect(Number(decodeNumber(positiveBuffer, positiveBuffer, 'int'))).toBe(12345);
  });
});

describe('encodeNumber', () => {
  it('encodes a  number', () => {
    expect(encodeNumber(Buffer.alloc(0), 12345n, 0, 'uint').toString('hex')).toBe(
      '0000000000000000000000000000000000000000000000000000000000003039'
    );
    expect(encodeNumber(Buffer.alloc(0), 0n, 0, 'uint').toString('hex')).toBe(
      '0000000000000000000000000000000000000000000000000000000000000000'
    );

    expect(encodeNumber(Buffer.alloc(0), 12345n, 0, 'int').toString('hex')).toBe(
      '0000000000000000000000000000000000000000000000000000000000003039'
    );
    expect(encodeNumber(Buffer.alloc(0), 0n, 0, 'int').toString('hex')).toBe(
      '0000000000000000000000000000000000000000000000000000000000000000'
    );
    expect(encodeNumber(Buffer.alloc(0), -12345n, 0, 'int').toString('hex')).toBe(
      'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffcfc7'
    );
  });

  it('throws if the number is out of range', () => {
    expect(() => encodeNumber(Buffer.alloc(0), 2n ** 256n, 0, 'uint')).toThrow();
    expect(() => encodeNumber(Buffer.alloc(0), -1n, 0, 'uint')).toThrow();
    expect(() => encodeNumber(Buffer.alloc(0), 2n ** 8n, 0, 'uint8')).toThrow();

    expect(() => encodeNumber(Buffer.alloc(0), 2n ** 256n, 0, 'int')).toThrow();
    expect(() => encodeNumber(Buffer.alloc(0), 2n ** 8n, 0, 'int8')).toThrow();
  });
});
