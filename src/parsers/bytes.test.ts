import { decodeBytes, encodeBytes } from './bytes';

describe('decodeBytes', () => {
  it('decodes a buffer', () => {
    const bytes = '8e2c5ee131ab880df3762f8cde96d453bdc680b001b561da3c64f4ae0e65a1d0';
    const buffer = Buffer.from(bytes, 'hex');

    expect(decodeBytes(buffer, buffer, 'bytes').toString('hex')).toBe(bytes);
  });
});

describe('encodeBytes', () => {
  it('encodes a buffer', () => {
    const bytes = '8e2c5ee131ab880df3762f8cde96d453bdc680b001b561da3c64f4ae0e65a1d0';
    const buffer = Buffer.from(bytes, 'hex');

    expect(encodeBytes(Buffer.alloc(0), buffer, 0, 'bytes')).toStrictEqual(buffer);
  });

  it('encodes a buffer with length between 0 > n > 32', () => {
    const bytes = '8e2c5ee131ab880df3762f8cde96d453bdc680b001';
    const buffer = Buffer.from(bytes, 'hex');

    expect(encodeBytes(Buffer.alloc(0), buffer, 0, 'bytes').toString('hex')).toBe(
      '00000000000000000000008e2c5ee131ab880df3762f8cde96d453bdc680b001'
    );
  });

  it('throws if the buffer is longer than 32 bytes', () => {
    const bytes = '8e2c5ee131ab880df3762f8cde96d453bdc680b001b561da3c64f4ae0e65a1d000';
    const buffer = Buffer.from(bytes, 'hex');

    expect(() => encodeBytes(Buffer.alloc(0), buffer, 0, 'bytes')).toThrow();
  });
});
