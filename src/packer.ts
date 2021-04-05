import { iterate } from './iterator';
import { address, array, bool, bytes, fixedBytes, fn, number, string, tuple } from './parsers';
import { Parser } from './types';
import { concat, toBuffer, toNumber } from './utils';

export const getParser = (type: string): Parser => {
  const parsers: { [key: string]: Parser } = {
    address,
    array,
    bool,
    bytes,
    fixedBytes,
    function: fn,
    number,
    string,
    tuple
  };

  if (parsers[type]) {
    return parsers[type];
  }

  const parser = Object.values(parsers).find((parser) => parser.isType?.(type));
  if (parser) {
    return parser;
  }

  throw new Error(`Type "${type}" is not supported`);
};

export const isDynamicParser = (parser: Parser, type: string): boolean => {
  const isDynamic = parser.isDynamic;
  if (typeof isDynamic === 'function') {
    return isDynamic(type);
  }

  return isDynamic;
};

type UpdateFunction = (buffer: Uint8Array) => Uint8Array;

interface PackState {
  staticBuffer: Uint8Array;
  dynamicBuffer: Uint8Array;
  functions: UpdateFunction[];
}

export const pack = (types: string[], values: unknown[], buffer: Uint8Array = new Uint8Array()): Uint8Array => {
  if (types.length !== values.length) {
    throw new Error('The length of the types and values must be equal');
  }

  const { staticBuffer, dynamicBuffer, functions } = types.reduce<PackState>(
    ({ staticBuffer, dynamicBuffer, functions }, type, index) => {
      const parser = getParser(type);
      const value = values[index];

      if (!isDynamicParser(parser, type)) {
        return {
          staticBuffer: parser.encode({ buffer: staticBuffer, value, type }),
          dynamicBuffer,
          functions
        };
      }

      const offset = dynamicBuffer.length;
      const staticOffset = staticBuffer.length;

      const newStaticBuffer = concat([staticBuffer, new Uint8Array(32).fill(0)]);
      const newDynamicBuffer = parser.encode({ buffer: dynamicBuffer, value, type });

      const fn = (oldBuffer: Uint8Array): Uint8Array => {
        return concat([
          oldBuffer.subarray(0, staticOffset),
          toBuffer(oldBuffer.length + offset),
          oldBuffer.subarray(staticOffset + 32)
        ]);
      };

      return {
        staticBuffer: newStaticBuffer,
        dynamicBuffer: newDynamicBuffer,
        functions: [...functions, fn]
      };
    },
    { staticBuffer: new Uint8Array(), dynamicBuffer: new Uint8Array(), functions: [] }
  );

  const updatedBuffer = functions.reduce<Uint8Array>((target, update) => update(target), staticBuffer);

  return concat([buffer, updatedBuffer, dynamicBuffer]);
};

export const unpack = (types: string[], buffer: Uint8Array): unknown[] => {
  const iterator = iterate(buffer);

  return types.map((type) => {
    const {
      value: { value, skip },
      done
    } = iterator.next();
    if (done) {
      throw new Error('Element is out of range');
    }

    const parser = getParser(type);
    const isDynamic = isDynamicParser(parser, type);

    if (isDynamic) {
      const pointer = Number(toNumber(value.subarray(0, 32)));
      const target = buffer.subarray(pointer);

      return parser.decode({ type, value: target, skip });
    }

    return parser.decode({ type, value, skip });
  });
};