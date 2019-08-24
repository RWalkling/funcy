import defunc, { Defunced } from '../defunced';
import '../augmentations/global';

export const None = Symbol('Empty entry');

export default class Cache<T> extends Map<T, [number, Defunced<T>]> {
    constructor(array?: T[]) {
        super(array === undefined
            ? undefined
            : array.map(value => [value, [1, None as any]])
        );
    }

    public update(oldValue: T, newValue: T) {
        if (oldValue === newValue) return;

        const entryOld = this.get(oldValue);
        if (entryOld !== undefined) {
            entryOld[0] -= 1;
            if (entryOld[0] === 0) this.delete(oldValue);
        }

        const entryNew = this.getset(newValue, [0, None as any]);
        entryNew[0] += 1;
    }

    public getDefunced(value: T): Defunced<T> | undefined {
        if (!this.has(value)) return undefined;

        const entry = this.get(value);

        if (entry![1] === None) return entry![1] = defunc(value);
        return entry![1];
    };
}
