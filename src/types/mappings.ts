type ByteLength =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32;
type IntegerLength =
  | 8
  | 16
  | 24
  | 32
  | 40
  | 48
  | 56
  | 64
  | 72
  | 80
  | 88
  | 96
  | 104
  | 112
  | 120
  | 128
  | 136
  | 144
  | 152
  | 160
  | 168
  | 176
  | 184
  | 192
  | 200
  | 208
  | 216
  | 224
  | 232
  | 240
  | 248
  | 256;

type Bytes = `bytes${ByteLength}`;
type Integer = `int${IntegerLength}`;
type UnsignedInteger = `uint${IntegerLength}`;

interface StaticTypes {
  address: string;
  bool: boolean;
  bytes: Uint8Array;
  function: Uint8Array;
  string: string;
}

type TypeMapWithoutArrays = StaticTypes &
  DynamicType<Bytes, Uint8Array> &
  DynamicType<Integer, bigint> &
  DynamicType<UnsignedInteger, bigint>;

/**
 * An object type with most possible ABI types, and their respective TypeScript type. Note that some dynamic types, like
 * `<type>[<length>]` and `fixed<M>x<N>` are not supported, and `unknown` is used instead.
 */
export type TypeMap = TypeMapWithoutArrays &
  {
    [K in keyof TypeMapWithoutArrays as `${K}[]`]: Array<TypeMapWithoutArrays[K]>;
  };

export type Type = keyof TypeMap;
export type TypeMapper<I extends Readonly<any[]>> = Mapper<TypeMap, Writable<I>>;

/**
 * Helper type to generate an object type from a union.
 */
type DynamicType<K extends string, T> = {
  [key in K]: T;
};

/**
 * Helper type that maps the input `I` to the types `T`.
 */
type Mapper<T, I extends any[]> = {
  [K in keyof I]: I[K] extends I[number] ? T[I[K]] : unknown;
};

/**
 * Helper type that removes a readonly modifier from a field.
 */
type Writable<T> = { -readonly [P in keyof T]: T[P] };
