interface IteratorValue {
  skip(length: number): void;
  value: Uint8Array;
}

export const iterate = function* (
  buffer: Uint8Array,
  size = 32
): Generator<IteratorValue, IteratorValue, IteratorValue> {
  for (let pointer = 0; pointer < buffer.length; pointer += size) {
    const skip = (length: number) => {
      if (length % size !== 0) {
        throw new Error('Length must be divisible by size');
      }

      pointer += length;
    };

    const value = buffer.subarray(pointer);

    yield { skip, value };
  }

  return {
    skip: () => undefined,
    value: new Uint8Array()
  };
};
