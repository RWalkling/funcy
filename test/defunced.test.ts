import defunc, { DefuncGeneric, fmap, Funcy } from '../src/';


describe('defunc', () => {
    const testValues = ['', null, undefined, NaN, 0, false, Symbol(), 'str', 42, BigInt(0), {}, [5, 3]];
    testValues.forEach(value => {
        test(`Can pass ${String(value)}`, () => expect(defunc(value)).toBe(value));
        test(`Can unpack ${String(value)}`, () => expect(defunc(() => value)).toBe(value));
    });

    const testFunctions = [() => {
    }, () => ({}), () => false];
    testFunctions.forEach(func => {
        test(`Unpacks ${String(func)}`, () => expect(defunc(func)).toEqual(func()));
        test(`Unpacks () => (${String(func)})`, () => expect(defunc(() => func)).toBe(func));
    });
});

describe('map', () => {
    const application = <T, R>(value: T, func: (value: T) => R) => func(value);
    // const expectToBeSame = <T, R>(value: T, func: (value: Defunced<T>) => R) => defunc(fmap(value, func));
    const expectToBeSame = <R, T, TReturn>(value: Funcy<R, T>, func: (value: DefuncGeneric<R, T>) => TReturn) => defunc(
        fmap(value, func));

    const testValues: [(value: any) => unknown, ...unknown[]][] = [
        [x => x + 5, 1, 2, 3, 4, 8, 9, 10],
        [x => x.toString(), 1, 2, 3, 4, 8, 9, 10],
        [x => x.startsWith('foo'), 'foo', 'bar', 'foobar', 'baz'],
    ];

    testValues.forEach(([func, ...values]) => {
        test(`Can pass each values from [${values}] through ${func}`, () =>
            expect(values.map(value => expectToBeSame(value, func)))
            .toEqual(values.map(value => application(value, func))),
        );
        test(
            `Can unpack each funcified values from [${values}] and put it through ${func}`, () =>
                expect(values.map(value => expectToBeSame(() => value, func)))
                .toEqual(values.map(value => application(value, func))),
        );
    });

    const testFunctions: [(value: any) => unknown, ...(() => unknown)[]][] = [
        [x => x + 5, () => 1, () => 2, () => 3, () => 4, () => 8, () => 9, () => 10],
        [x => x.toString(), () => 1, () => 2, () => 3, () => 4, () => 8, () => 9, () => 10],
        [x => x.startsWith('foo'), () => 'foo', () => 'bar', () => 'foobar', () => 'baz'],
    ];

    testFunctions.forEach(([func, ...values]) => {
        test(`Unpacks each values from [${values}] and puts it through ${func}`, () =>
            expect(values.map(value => expectToBeSame(value, func)))
            .toEqual(values.map(value => application((value as () => unknown)(), func))),
        );
        test(
            `Can unpack each values from [${values}] and put it through ${func}`, () =>
                expect(values.map(value => defunc(fmap(() => value, defunced => func(defunced())))))
                .toEqual(values.map(value => application((value as () => unknown)(), func))),
        );
    });
});
