import createKeccakHash from 'keccak';

/**
 * Returns the Keccak-256 hash of a string, as a hexadecimal string.
 *
 * @param {string} input
 * @return {Buffer}
 */
export const keccak256 = (input: string): Buffer => {
  return createKeccakHash('keccak256').update(input).digest();
};
