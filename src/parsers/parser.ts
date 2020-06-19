// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EncodeFunction = (buffer: Buffer, value: any, type: string) => Buffer;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DecodeFunction = (value: Buffer, buffer: Buffer, type: string) => any;

export interface Parser {
  dynamic?: true;
  encode: EncodeFunction;
  decode: DecodeFunction;
}
