# `@findeth/abi`

![Version](https://img.shields.io/npm/v/@findeth/abi) ![License](https://img.shields.io/github/license/FindETH/abi) [![GitHub CI](https://github.com/FindETH/abi/workflows/CI/badge.svg)](https://github.com/FindETH/abi/actions) [![codecov](https://codecov.io/gh/FindETH/abi/branch/master/graph/badge.svg)](https://codecov.io/gh/FindETH/abi)

`@findeth/abi` is a zero-dependencies ABI encoder and decoder library for FindETH. It supports both Node.js and web browsers. **This library is experimental**, and may not work with all contract interfaces. It is used in the FindETH applications, that can be found here:

- [Web](https://github.com/FindETH/web)

Currently, most types (except fixed-point numbers (`fixed<M>x<N>`), and fixed-length arrays `type<M>`) are supported.

**Note**: This is a work-in-progress version of FindETH, and is **not** production-ready. For the current version of FindETH, please refer to [this repository](https://github.com/Mrtenz/FindETH/tree/master). The public API _may_ change in minor releases below 1.0.0 (though this is unlikely).

---

## Installation

You can install `@findeth/abi` with Yarn (recommended) or NPM:

```
$ yarn add @findeth/abi
```

```
$ npm install @findeth/abi
```

**Note**: If you are using TypeScript, `@findeth/abi` requires TypeScript 4.1 or newer. This is used for automatically inferring the types of the input and output, based on the specified `types`.

## Getting Started

You can use the `encode` and `decode` functions to encode and decode ABI respectively.

### Encode

The encode function takes an array of ABI types (e.g., `["string", "uint256"]`) and an array of values to encode. For example:

```ts
import { encode, toHex } from "@findeth/abi";

const buffer = encode(["string", "uint256"], ["foo bar", 12345]);
console.log(toHex(buffer));

// 000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000030390000000000000000000000000000000000000000000000000000000000000007666f6f2062617200000000000000000000000000000000000000000000000000
```

### Decode

The decode function takes an array of ABI types, and a buffer (`Uint8Array`) to decode. Note that Node.js `Buffer`s are compatible with `Uint8Array`, but in order to maintain full compatibility with web browsers (without the need for polyfills), this library does not use `Buffer`. Example:

```ts
import { decode, fromHex } from "@findeth/abi";

const value = fromHex("000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000030390000000000000000000000000000000000000000000000000000000000000007666f6f2062617200000000000000000000000000000000000000000000000000");
console.log(decode(["string", "uint256"], value));

// ["foo bar", 12345n]
```

## Development

Install dependencies with `yarn`:

```
$ yarn
```

To run automated tests, use the `test` script:

```
$ yarn test
```


To build the library, use the `build` script:

```
$ yarn build
```
