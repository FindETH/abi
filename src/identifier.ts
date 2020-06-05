import { ContractFunction, ContractInput } from './contract';
import { keccak256 } from './utils/keccak256';

/**
 * Parse the type of a contract input to a `string`.
 *
 * @param {ContractInput} input
 * @return {string}
 */
export const parseType = (input: ContractInput): string => {
  if (input.components) {
    return `(${input.components.map(parseType)})`;
  }

  return input.type;
};

/**
 * Get the function identifier of a contract function as `Buffer`.
 *
 * @param {ContractFunction} contractFunction
 * @return {string}
 */
export const getIdentifier = (contractFunction: ContractFunction): Buffer => {
  const types = contractFunction.inputs.map(parseType).join(',');

  return keccak256(`${contractFunction.name}(${types})`).slice(0, 4);
};
