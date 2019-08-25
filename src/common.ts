export type Primitives = string | number | symbol | boolean | object | undefined | bigint;
export type AsPrimitive<TThen> = TThen extends Primitives ? TThen : never;
export type TupleOf<T> = [...T[]] | [T, ...T[]];
