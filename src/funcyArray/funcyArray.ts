import { Defunced } from '../defunced';
import '../augmentations/global';
import Cache from './cache';

type Primitives = string | number | symbol | boolean | object | undefined | bigint
type TupleOf<T> = [...T[]] | [T, ...T[]];

type MappedDefunc<TTuple extends TupleOf<unknown>> = {
    [Key in keyof TTuple]: Defunced<TTuple[Key]>;
}

const propertyKeyIsIndex = (propertyKey: PropertyKey) => typeof propertyKey === 'string' && /^\d+$/.test(propertyKey);

export default <Container extends TupleOf<Primitives>,
    TArray extends TupleOf<Container[number]> | unknown[] = unknown[]>(array?: TArray): MappedDefunc<TArray> => {
    const cache = new Cache<TArray[keyof TArray]>(array as any);

    const proxy = new Proxy(array !== undefined ? array : [], {
        set<TPropertyKey extends keyof TArray>(
            target: TArray,
            propertyKey: TPropertyKey,
            value: TArray[TPropertyKey],
        ): boolean {
            if (propertyKeyIsIndex(propertyKey)) {
                const oldValue = target[propertyKey];
                cache.update(oldValue, value);
            }

            target[propertyKey] = value;
            return true;
        },

        get: <TPropertyKey extends keyof TArray>(
            target: TArray,
            propertyKey: TPropertyKey,
        ): TArray[TPropertyKey] | Defunced<TArray[keyof TArray]> | undefined =>
            propertyKeyIsIndex(propertyKey)
                ? cache.getDefunced(target[propertyKey])
                : target[propertyKey],
    });

    return proxy as any;
}
