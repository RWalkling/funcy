import defunc, { DefuncGeneric, Funcy } from '../defunced';
import '../augmentations/global';

const None = Symbol('Empty entry');

export default class Cache<R, T> extends Map<Funcy<R, T>, [number, DefuncGeneric<R, T>]> {
    constructor(array?: Funcy<R, T>[]) {
        super(array === undefined
            ? undefined
            : array.map(value => [value, [1, None as any]])
        );
    }

    public update(oldValue: Funcy<R, T>, newValue: Funcy<R, T>) {
        if (oldValue === newValue) return;

        const entryOld = this.get(oldValue);
        if (entryOld !== undefined) {
            entryOld[0] -= 1;
            if (entryOld[0] === 0) this.delete(oldValue);
        }

        const entryNew = this.getset(newValue, [0, None as any]);
        entryNew[0] += 1;
    }

    public getDefunced(value: Funcy<R, T>): DefuncGeneric<R, T> | undefined {
        if (!this.has(value)) return undefined;

        const entry = this.get(value);

        if (entry![1] === None as any) return entry![1] = defunc(value);
        return entry![1];
    }
}
