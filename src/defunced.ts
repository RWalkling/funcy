export type Funcy<T> = T | (() => T);
export type Defunced<T> = T extends () => infer R ? R : T

const isFunction = <T>(value: any): value is () => T => typeof value === 'function';

export const defunc = <T>(value: T): Defunced<T> => isFunction<Defunced<T>>(value) ? value() : value as Defunced<T>;
export const fmap = <T, R>(value: T, func: (value: Defunced<T>) => R): Funcy<R> => () => func(defunc(value));

export default defunc;
