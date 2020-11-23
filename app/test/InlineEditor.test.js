import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import InlineEditor from '../jsx/InlineEditor.jsx';

/**
 * Tests validation after clicking the button OK
 */
test('validation after clicking the button OK', () => {
    render(
        <InlineEditor
            attribute={{
                label: 'Header1 text size (em)',
                value: '1.4',
                type: 'em',
                reference: 'sizes.h1',
                userInput: '1.4'
            }}
            updateValue={() => null}
            editorElementLinkRef={{}}
        />
    );

    // Invalid parentheses:
    const textbox = screen.queryByText('Value:').nextElementSibling; // get textbox Node element
    fireEvent.change(textbox, { target: { value: '1.4(' } }); // write in textbox
    fireEvent.click(screen.queryByText('OK')); // click on button 'OK'
    expect(textbox.style.outline).toBe('auto 1px red');

    // Valid parentheses:
    fireEvent.change(textbox, { target: { value: '1.4()' } }); // write in textbox
    fireEvent.click(screen.queryByText('OK')); // click on button 'OK'
    expect(textbox.style.outline).toBeFalsy();

    // Invalid self-referencing:
    fireEvent.change(textbox, { target: { value: '1.4 {sizes.h1}' } }); // write in textbox
    fireEvent.click(screen.queryByText('OK')); // click on button 'OK'
    expect(textbox.style.outline).toBe('auto 1px red');

    // Valid referencing other attribute:
    fireEvent.change(textbox, { target: { value: '{sizes.h2}' } }); // write in textbox
    fireEvent.click(screen.queryByText('OK')); // click on button 'OK'
    expect(textbox.style.outline).toBeFalsy();
});
