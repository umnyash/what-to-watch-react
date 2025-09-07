export type FlattenNestedRecords<T> =
  T extends Record<string, Record<string, unknown>>
  ? {
    [K in keyof T]: T[K][keyof T[K]];
  }[keyof T]
  : never;
