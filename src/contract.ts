import { ContractInput, ContractInputTuple } from './types';

const isTuple = (input: ContractInput): input is ContractInputTuple => {
  return input.type === 'tuple';
};

/**
 * Parse the type of a contract input to a `string`.
 *
 * @param {ContractInput} input
 * @return {string}
 */
export const parseType = (input: ContractInput): string => {
  if (isTuple(input)) {
    return `(${input.components.map(parseType)})`;
  }

  return input.type;
};
