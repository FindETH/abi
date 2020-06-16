// tslint:disable-next-line:no-any
export type EncodeFunction = (buffer: Buffer, value: any, type: string) => Buffer;

// tslint:disable-next-line:no-any
export type DecodeFunction = (value: Buffer, buffer: Buffer, type: string) => any;

export interface Parser {
  dynamic?: true;
  encode: EncodeFunction;
  decode: DecodeFunction;
}
