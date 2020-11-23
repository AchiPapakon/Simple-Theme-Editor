/**
 * Returns a new state after parsing all the attributes for references to each other.
 * @param {state object} oldState The state object
 * @param {string} reference The attribute reference e.g. "colors.primary"
 */
export const parseAttributes = (oldState, reference) => {
    let newState = { ...oldState };
    // Search the userInput of the attributes for the {reference} and replace it in the 'value'
    const newStateAttributes = oldState.attributes;
    Object.keys(newStateAttributes).forEach((group) => {
        Object.keys(newStateAttributes[group]).forEach((attributeName) => {
            // excluding self:
            if (`${group}.${attributeName}` === reference) {
                return;
            }
            const { userInput } = newStateAttributes[group][attributeName];

            // Is there another attribute which references the {reference}?
            if (userInput.match(`{${reference}}`)) {
                const parsedUserInput = userInput.replace(/{(\w+\.\w+)}/g, (str, p1) => {
                    const matchReference = p1;
                    const [matchProperty1, matchProperty2] = matchReference.split('.');
                    return newStateAttributes[matchProperty1][matchProperty2].value;
                });
                newState = {
                    ...newState,
                    attributes: {
                        ...newState.attributes,
                        [group]: {
                            ...newState.attributes[group],
                            [attributeName]: {
                                ...newState.attributes[group][attributeName],
                                value: parsedUserInput // Assign the replaced value
                            }
                        }
                    }
                };
                // Call self again with the newState and the new reference.
                newState = parseAttributes(newState, newState.attributes[group][attributeName].reference);
            }
        });
    });
    // console.log('newState inside parseAttributes:', newState);
    return newState;
};

/**
 * @param {Object} attribute The attribute whose value is to be retrieved
 * @returns {string} The 'value' concatenated with 'em' or 'px' if applicable
 */
export const getStyle = (attribute) => {
    const isValueNumber = !Number.isNaN(attribute.value / 1);
    if (['px', 'em'].includes(attribute.type) && isValueNumber) {
        return attribute.value + attribute.type;
    }
    return attribute.value;
};

/**
 * Cleans the input string of non-parentheses/brackets/curly brackets,
 * and returns a boolean if there are any open or misplaced ones.
* @param {string} str
* @return {boolean}
*/
export const isValidParentheses = (str) => {
    const symbols = [['(', ')'], ['[', ']'], ['{', '}']];
    const stack = [];

    const cleanInput = str.replace(/[^(){}[\]]/g, '');

    for (let i = 0; i < cleanInput.length; i++) {
        const c = cleanInput[i];
        if (c === symbols[0][0]) {
            stack.push(symbols[0][1]);
        } else if (c === symbols[1][0]) {
            stack.push(symbols[1][1]);
        } else if (c === symbols[2][0]) {
            stack.push(symbols[2][1]);
        } else if (c === stack[stack.length - 1]) {
            stack.pop();
        } else {
            return false;
        }
    }

    return stack.length === 0;
};
