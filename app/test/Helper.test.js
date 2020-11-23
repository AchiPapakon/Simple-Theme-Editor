import { getStyle, isValidParentheses } from '../js/Helper';

describe('getStyle function', () => {
    test('Appends \'em\' correctly', () => {
        expect(getStyle({ value: '1.1', type: 'em' })).toBe('1.1em');
    });

    test('Doesn\'t append \'em\' on a type em when there is different than numeric value', () => {
        expect(getStyle({ value: '10px', type: 'em' })).toBe('10px');
    });

    test('Appends \'px\' correctly', () => {
        expect(getStyle({ value: '10', type: 'px' })).toBe('10px');
    });

    test('Doesn\'t append \'px\' on a type px when there is different than numeric value', () => {
        expect(getStyle({ value: '10em', type: 'px' })).toBe('10em');
    });

    test('Doesn\'t append anything with type text', () => {
        expect(getStyle({ value: '#ffffff', type: 'text' })).toBe('#ffffff');
    });

    test('Doesn\'t append anything with type color', () => {
        expect(getStyle({ value: '#ffffff', type: 'color' })).toBe('#ffffff');
    });

    test('calc function', () => {
        expect(getStyle({ value: 'calc(2 * 3px)', type: 'px' })).toBe('calc(2 * 3px)');
    });
});

describe('isValidParentheses function', () => {
    test('Empty input', () => {
        expect(isValidParentheses('')).toBe(true);
    });

    test('Valid reference', () => {
        expect(isValidParentheses('{colors.primary}')).toBe(true);
    });

    test('Invalid brackets', () => {
        expect(isValidParentheses('{colors.primary')).toBe(false);
    });

    test('Invalid brackets', () => {
        expect(isValidParentheses('colors.primary}')).toBe(false);
    });

    test('calc function', () => {
        expect(isValidParentheses('calc(2 * 3px)')).toBe(true);
    });
});
