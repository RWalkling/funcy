export declare type Funcy<F, T> = ([F] extends [never] ? never : () => F) | T;

export type DefuncInto<F, T> = [unknown] extends [F] ? T : F;

type Defunced_<T> = [T] extends [(() => infer R)] ? R : Exclude<T, () => unknown>;
export type Defunced<T> = Defunced_<NonNullable<T>>;

const isFunction = <T>(value: any): value is () => T => typeof value === 'function';

export const defunc = <T>(value: T): Defunced<T> => isFunction<Defunced<T>>(value) ? value() : value as Defunced<T>;
export const fmap = <T, R>(value: T, func: (value: Defunced<T>) => R) => () => func(defunc(value));

export default defunc;
