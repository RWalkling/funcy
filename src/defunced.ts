import { AsPrimitive, Primitives } from './common';

type Funcy_<F extends Primitives, S extends Primitives> = (() => F) | S;
export type Funcy<F, T> = Funcy_<AsPrimitive<F>, AsPrimitive<T>>;

export type DefuncInto<F, T> = [unknown] extends [F] ? T : F;

type Defunced_<T> = [T] extends [(() => infer R)] ? R : Exclude<T, () => unknown>;
export type Defunced<T> = Defunced_<NonNullable<T>>;

const isFunction = <T>(value: any): value is () => T => typeof value === 'function';

export const defunc = <T>(value: T): Defunced<T> => isFunction<Defunced<T>>(value) ? value() : value as Defunced<T>;
export const fmap = <T, R>(value: T, func: (value: Defunced<T>) => R) => () => func(defunc(value));

export default defunc;
