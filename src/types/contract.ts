import type { Type } from './index';

/**
 * Contract input that is not a `tuple` and thus does not contain extra `components`.
 */
export interface ContractInputRegular {
  name: string;
  type: Type | string;
}

/**
 * Contract input that is a `tuple` and thus contains extra `components`.
 */
export interface ContractInputTuple {
  name: string;
  type: 'tuple';
  components: ContractInput[];
}

export type ContractInput = ContractInputRegular | ContractInputTuple;

/**
 * Constant contract function, where `stateMutability` is either `pure` or `view`.
 */
export interface ConstantContractFunction {
  stateMutability: 'pure' | 'view';
  constant: true;

  /**
   * Defaults to `false`.
   */
  payable?: false;
}

/**
 * Payable contract function where `stateMutability` is `payable`.
 */
export interface PayableContractFunction {
  stateMutability: 'payable';

  /**
   * Defaults to `false`.
   */
  constant?: false;
  payable: true;
}

/**
 * Non-payable contract function where `stateMutability` is `nonpayable`.
 */
export interface NonPayableContractFunction {
  stateMutability: 'nonpayable';
  constant: false;

  /**
   * Defaults to `false`.
   */
  payable?: false;
}

export type NonConstantContractFunction = PayableContractFunction | NonPayableContractFunction;

/**
 * Contract function.
 */
export type ContractFunction = (ConstantContractFunction | NonConstantContractFunction) & {
  /**
   * Defaults to `function`.
   */
  type?: 'function' | 'constructor' | 'fallback';
  name: string;
  inputs: ContractInput[];

  /**
   * `undefined` if the function doesn't have any outputs.
   */
  outputs?: ContractInput[];
};

export type ContractEventInput = ContractInput & { indexed: boolean };

/**
 * Contract event.
 */
export interface ContractEvent {
  type: 'event';
  name: string;
  inputs: ContractEventInput[];
  anonymous: boolean;
}

export type ContractInterface = ContractFunction | ContractEvent;
