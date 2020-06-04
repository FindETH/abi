export const concat = (target: Buffer, value: Buffer, position: number): Buffer => {
  return Buffer.concat([target.slice(0, position), value, target.subarray(position)]);
};
