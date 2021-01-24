import { ContractFunction, ContractInput } from './contract';
import { getIdentifier } from './identifier';
import { pack, unpack } from './parsers/array';
import { concat, fromHex } from './utils';

/**
 * Encode the input data with the provided types.
 *
 * @param {(ContractInput | string)[]} input
 * @param {unknown[]} values
 * @return {Uint8Array}
 */
export const encode = (input: Array<ContractInput | string>, values: unknown[]): Uint8Array => {
  const types = input.map((type) => {
    if (typeof type === 'string') {
      return type;
    }

    return type.type;
  });

  return pack(new Uint8Array(0), values, types);
};

/**
 * Encode the input data with the provided types, and prepend the function identifier.
 *
 * @param {ContractFunction} contractFunction
 * @param {unknown[]} values
 * @return {Uint8Array}
 */
export const encodeWithIdentifier = (contractFunction: ContractFunction, values: unknown[]): Uint8Array => {
  const identifier = fromHex(getIdentifier(contractFunction));
  const encoded = encode(contractFunction.inputs, values);

  return concat([identifier, encoded]);
};

export const decode = <T extends unknown[]>(input: Array<ContractInput | string>, buffer: Uint8Array): T => {
  const types = input.map((type) => {
    if (typeof type === 'string') {
      return type;
    }

    return type.type;
  });

  return unpack(buffer, types) as T;
};
