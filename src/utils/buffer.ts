const BUFFER_WIDTH = 32;
const HEX_REGEX = /^[a-f0-9]+$/i;

export type BinaryLike = string | number | bigint | ArrayBufferLike | number[];

export const stripPrefix = (value: string): string => {
  if (value.startsWith('0x')) {
    return value.substring(2);
  }

  return value;
};

/**
 * Returns an instance of `TextEncoder` that works with both Node.js and web browsers.
 *
 * @return {TextEncoder}
 */
export const getTextEncoder = (): TextEncoder => {
  if (typeof TextEncoder === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Encoder = require('util').TextEncoder;
    return new Encoder();
  }

  return new TextEncoder();
};

/**
 * Returns an instance of `TextDecoder` that works with both Node.js and web browsers.
 *
 * @return {TextDecoder}
 */
export const getTextDecoder = (encoding = 'utf8'): TextDecoder => {
  if (typeof TextEncoder === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Decoder = require('util').TextDecoder;
    return new Decoder(encoding);
  }

  return new TextDecoder(encoding);
};

/**
 * Get a buffer as UTF-8 encoded string.
 *
 * @param {Uint8Array} data
 * @return {string}
 */
export const toUtf8 = (data: Uint8Array): string => {
  return getTextDecoder().decode(data);
};

/**
 * Get a UTF-8 encoded string as buffer.
 *
 * @param {string} data
 * @return {Uint8Array}
 */
export const fromUtf8 = (data: string): Uint8Array => {
  return getTextEncoder().encode(data);
};

/**
 * Get a Uint8Array as hexadecimal string
 *
 * @param {Uint8Array} data
 * @return {string}
 */
export const toHex = (data: Uint8Array): string => {
  return Array.from(data)
    .map((n) => `0${n.toString(16)}`.slice(-2))
    .join('');
};

/**
 * Get a hexadecimal string as Uint8Array.
 *
 * @param {string} data
 * @return {Uint8Array}
 */
export const fromHex = (data: string): Uint8Array => {
  if (data.startsWith('0x')) {
    data = data.slice(2);
  }

  if (data.length % 2 !== 0) {
    throw new Error('Length must be even');
  }

  if (!data.match(HEX_REGEX)) {
    throw new Error('Input must be hexadecimal');
  }

  return new Uint8Array(data.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
};

/**
 * Attempt to parse a value as Uint8Array.
 *
 * @param {BinaryLike} data
 * @return {Uint8Array}
 */
export const toBuffer = (data: BinaryLike): Uint8Array => {
  if (typeof data === 'string') {
    return fromHex(data);
  }

  if (typeof data === 'number' || typeof data === 'bigint') {
    const string = data.toString(16);
    return fromHex(string.padStart(BUFFER_WIDTH * 2, '0'));
  }

  return new Uint8Array(data);
};

/**
 * Safe function to merge multiple Uint8Arrays into a single Uint8array.
 *
 * @param {Uint8Array[]} buffers
 * @return {Uint8Array}
 */
export const concat = (buffers: Uint8Array[]): Uint8Array => {
  return buffers.reduce((a, b) => {
    const buffer = new Uint8Array(a.length + b.length);
    buffer.set(a);
    buffer.set(b, a.length);

    return buffer;
  }, new Uint8Array(0));
};

/**
 * Concatenate two buffers by placing one buffer at a specific position in another buffer.
 *
 * @param {Uint8Array} a
 * @param {Uint8Array} b
 * @param {number} position
 * @return {Uint8Array}
 */
export const concatAt = (a: Uint8Array, b: Uint8Array, position: number): Uint8Array => {
  return concat([a.slice(0, position), b, a.slice(position)]);
};

/**
 * Add padding to a buffer. If the buffer is larger than `length`, this function won't do anything. If it's smaller, the
 * buffer will be padded to the specified length, with extra zeroes at the end.
 *
 * @param {Uint8Array} buffer
 * @param {number} [length]
 * @return {Uint8Array}
 */
export const addPadding = (buffer: Uint8Array, length = BUFFER_WIDTH): Uint8Array => {
  const padding = new Uint8Array(Math.max(length - buffer.length, 0)).fill(0x00);
  return concat([buffer, padding]);
};

/**
 * Get a number from a buffer.
 *
 * @param {Uint8Array} buffer
 */
export const toNumber = (buffer: Uint8Array): bigint => {
  const hex = toHex(buffer);
  if (hex.length === 0) {
    return BigInt(0);
  }

  return BigInt(`0x${hex}`);
};
