import createKeccakHash from 'keccak';
import { BinaryLike, fromHex, toBuffer, toHex } from './buffer';

/**
 * Returns the Keccak-256 hash of a string, as a hexadecimal string.
 *
 * @param {string} input
 * @return {string}
 */
export const keccak256 = (input: BinaryLike): Uint8Array => {
  const buffer = toBuffer(input);
  return fromHex(createKeccakHash('keccak256').update(toHex(buffer), 'hex').digest('hex'));
};
