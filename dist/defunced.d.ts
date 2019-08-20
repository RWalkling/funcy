export declare type Funcy<T> = T | (() => T);
export declare type Defunced<T> = T extends () => infer R ? R : T;
export declare const defunc: <T>(value: T) => Defunced<T>;
export declare const fmap: <T, R>(value: T, func: (value: Defunced<T>) => R) => Funcy<R>;
export default defunc;
