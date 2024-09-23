export const excludeFalsy = <T>(arr: (T | 0 | '' | null | undefined)[]) => arr.filter((v): v is T => v != null);
