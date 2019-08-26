import { funcyArray } from '../src/';

describe('funcyArray', () => {
    describe('get items', () => {
        const testCase = (input: Parameters<typeof funcyArray>[0], expected: object) => () => {
            const array = funcyArray(input);
            Object.entries(expected).forEach(([index, expectedValue]) => {
                expect(array[index]).toEqual(expectedValue);
            });
        };

        test('empty', testCase([], {
            0: undefined,
            5: undefined,
            '-5': undefined,
            'length': 0,
        }));

        test('keep, unpack and cache', () => {
            const element = Symbol('single element');
            const mockElement = jest.fn(() => element);
            testCase([element, () => element, () => element, mockElement, mockElement], {
                0: element,
                '1': element,
                2: element,
                3: element,
                4: element,
                '1.0': undefined,
                '01': undefined,
                '01.0': undefined,
                '-1': undefined,
                'length': 5,
            })();
            expect(mockElement).toHaveBeenCalledTimes(1);
        });

        test('only unpack once', () => {
            const element = Symbol('single element');
            const firstMock = jest.fn(() => element);
            const secondMock = jest.fn(() => firstMock);

            const array = funcyArray([secondMock]);
            expect(array[0]).toBe(firstMock);
            expect(array[0]).toBe(firstMock);

            expect(secondMock).toHaveBeenCalledTimes(1);
            expect(firstMock).not.toHaveBeenCalled();
        });
    });

    test('set items', () => {
        const array = funcyArray();

        expect(array.length).toBe(0);

        const funcyFour = () => 4;
        [0, '1', 'two', () => 3, funcyFour, () => funcyFour, funcyFour].forEach(value => array.push(value));
        const expected = [0, '1', 'two', 3, 4, funcyFour, 4];

        expect([...array]).toEqual(expected);

        array[8.000] = 8;

        expect(array.length).toBe(9);
        expect([...array]).toEqual([...expected, undefined, 8]);
    });
});
