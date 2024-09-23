export const assert: <T>(x: T | null | undefined) => asserts x is T = (x) => {
  if (x === null || x === undefined) {
    throw new Error('Should exist value.');
  }
};
