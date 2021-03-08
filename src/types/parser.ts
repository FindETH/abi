export type EncodeFunction<T> = (buffer: Uint8Array, value: T, type: string) => Uint8Array;
export type DecodeFunction<T> = (value: Uint8Array, buffer: Uint8Array, type: string) => T;
