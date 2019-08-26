export declare type Funcy<R, T> = (() => R) | T;

export type DefuncGeneric<R, T> = [R] extends [never] ? T : R;
export type Defunced<TFuncy> = TFuncy extends (() => infer R) ? R : TFuncy;

const isFunction = <T>(value: any): value is () => unknown => typeof value === 'function';

export const defunc = <R, T>(value: Funcy<R, T>) => (isFunction(value) ? value() : value) as DefuncGeneric<R, T>;
export const fmap = <R, T, TReturn>(value: Funcy<R, T>, func: (value: DefuncGeneric<R, T>) => TReturn) => () => func(defunc(value));

export default defunc;
