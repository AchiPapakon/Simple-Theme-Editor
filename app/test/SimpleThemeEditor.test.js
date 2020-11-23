/* eslint-disable prefer-destructuring */
import React from 'react';
import ReactDOM from 'react-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import Outline from '../jsx/SimpleThemeEditor.jsx';

test('Renders Outline without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Outline />, div);
    ReactDOM.unmountComponentAtNode(div);
});

/**
 * Goal: Collapses all titles one by one and expands them again.
 * 1. Checks that a title is visible
 * 2. Checks that its first child is visible
 * 3. Clicks on the title
 * 4. Checks that the first child is not visible anymore
 * 5. Clicks on the title again
 * 6. The first child becomes visible again
 */
test('Group titles collapse and expand', () => {
    render(<Outline />);

    // General colors group
    expect(screen.queryByText('General colors')).toBeTruthy();
    expect(screen.queryByText(/^Primary font color/)).toBeTruthy();
    fireEvent.click(screen.queryByText('General colors'));
    expect(screen.queryByText(/^Primary font color:/)).toBeNull();

    // Global sizes group
    expect(screen.queryByText('Global sizes')).toBeTruthy();
    expect(screen.queryByText(/^Default text size/)).toBeTruthy();
    fireEvent.click(screen.queryByText('Global sizes'));
    expect(screen.queryByText(/^Default text size/)).toBeNull();

    // Text field group
    expect(screen.queryByText('Text field')).toBeTruthy();
    expect(screen.queryByText(/^Text size/)).toBeTruthy();
    fireEvent.click(screen.queryByText('Text field'));
    expect(screen.queryByText(/^Text size/)).toBeNull();

    // Buttons group
    expect(screen.queryByText('Buttons')).toBeTruthy();
    expect(screen.queryByText('buttons.fontSize')).toBeTruthy();
    fireEvent.click(screen.queryByText('Buttons'));
    expect(screen.queryByText('buttons.fontSize')).toBeNull();

    /**
     * Reverse process (expanding):
     */
    // Buttons group
    fireEvent.click(screen.queryByText('Buttons'));
    expect(screen.queryByText('buttons.fontSize')).toBeTruthy();

    // Text field group
    fireEvent.click(screen.queryByText('Text field'));
    expect(screen.queryByText(/^Text size/)).toBeTruthy();

    // Global sizes group
    fireEvent.click(screen.queryByText('Global sizes'));
    expect(screen.queryByText(/^Default text size/)).toBeTruthy();

    // General colors group
    fireEvent.click(screen.queryByText('General colors'));
    expect(screen.queryByText(/^Primary font color/)).toBeTruthy();
});

describe('Attribute referencing', () => {
    /**
     * Goal: Check that Chain referencing works.
     * 1.
     * - Clicks on 'colors.primary' to open the editor
     * - Enters '{colors.primaryBackground}'
     * - Click button 'OK'
     * - value changes to #ffffff
     * - Clicks on 'colors.primary' to close the editor
     *
     * 2. Ditto for 'colors.primaryBackground' -> '{colors.secondary}'
     * 3. Ditto for 'colors.secondary' -> '{colors.secondaryBackground}'
     * 4. Ditto for 'colors.secondaryBackground -> 'red'
     *
     * All 4 values should update to 'red'.
     */
    test('Chain referencing works', () => {
        render(<Outline />);

        // 1.
        const nodeColorsPrimary = screen.queryByText(/^colors.primary$/);
        expect(nodeColorsPrimary.nextSibling).toBeNull();
        fireEvent.click(screen.queryByText(/^colors.primary$/)); // Click on 'colors.primary'
        expect(nodeColorsPrimary.nextSibling.nodeName).toEqual('SPAN'); // Closing 'x' exists
        let textbox = nodeColorsPrimary.parentNode.nextSibling.firstChild.childNodes[1];
        fireEvent.change(textbox, { target: { value: '{colors.primaryBackground}' } }); // write in textbox
        fireEvent.click(screen.queryByText('OK')); // click on button 'OK'
        expect(textbox.value).toBe('{colors.primaryBackground}');
        expect(screen.queryByText('Primary font color:').firstElementChild.innerHTML).toBe('#ffffff'); // The processed value changes
        fireEvent.click(screen.queryByText(/^colors.primary$/)); // close the editor
        expect(nodeColorsPrimary.nextSibling).toBeNull(); // editor closed

        // 2.
        const nodeColorsPrimaryBackground = screen.queryByText(/^colors.primaryBackground$/);
        expect(nodeColorsPrimaryBackground.nextSibling).toBeNull();
        fireEvent.click(screen.queryByText(/^colors.primaryBackground$/)); // Click on 'colors.primaryBackground'
        expect(nodeColorsPrimaryBackground.nextSibling.nodeName).toEqual('SPAN'); // Closing 'x' exists
        textbox = nodeColorsPrimaryBackground.parentNode.nextSibling.firstChild.childNodes[1];
        fireEvent.change(textbox, { target: { value: '{colors.secondary}' } }); // write in textbox
        fireEvent.click(screen.queryByText('OK')); // click on button 'OK'
        expect(textbox.value).toBe('{colors.secondary}');
        expect(screen.queryByText('Primary font color:').firstElementChild.innerHTML).toBe('#ffffff'); // The processed value changes
        expect(screen.queryByText('Primary background color:').firstElementChild.innerHTML).toBe('#ffffff'); // The processed value changes
        fireEvent.click(screen.queryByText(/^colors.primaryBackground$/)); // close the editor
        expect(nodeColorsPrimaryBackground.nextSibling).toBeNull(); // editor closed

        // 3.
        const nodeColorsSecondary = screen.queryByText(/^colors.secondary$/);
        expect(nodeColorsSecondary.nextSibling).toBeNull();
        fireEvent.click(screen.queryByText(/^colors.secondary$/)); // Click on 'colors.secondary'
        expect(nodeColorsSecondary.nextSibling.nodeName).toEqual('SPAN'); // Closing 'x' exists
        textbox = nodeColorsSecondary.parentNode.nextSibling.firstChild.childNodes[1];
        fireEvent.change(textbox, { target: { value: '{colors.secondaryBackground}' } }); // write in textbox
        fireEvent.click(screen.queryByText('OK')); // click on button 'OK'
        expect(textbox.value).toBe('{colors.secondaryBackground}');
        expect(screen.queryByText('Primary font color:').firstElementChild.innerHTML).toBe('#4a86e8'); // The processed value changes
        expect(screen.queryByText('Primary background color:').firstElementChild.innerHTML).toBe('#4a86e8'); // The processed value changes
        expect(screen.queryByText('Secondary font color:').firstElementChild.innerHTML).toBe('#4a86e8'); // The processed value changes
        fireEvent.click(screen.queryByText(/^colors.secondary$/)); // close the editor
        expect(nodeColorsSecondary.nextSibling).toBeNull(); // editor closed

        // 4.
        const nodeColorsSecondaryBackground = screen.queryByText(/^colors.secondaryBackground$/);
        expect(nodeColorsSecondaryBackground.nextSibling).toBeNull();
        fireEvent.click(screen.queryByText(/^colors.secondaryBackground$/)); // Click on 'colors.secondary'
        expect(nodeColorsSecondaryBackground.nextSibling.nodeName).toEqual('SPAN'); // Closing 'x' exists
        textbox = nodeColorsSecondaryBackground.parentNode.nextSibling.firstChild.childNodes[1];
        fireEvent.change(textbox, { target: { value: 'red' } }); // write in textbox
        fireEvent.click(screen.queryByText('OK')); // click on button 'OK'
        expect(textbox.value).toBe('red');
        expect(screen.queryByText('Primary font color:').firstElementChild.innerHTML).toBe('red'); // The processed value changes
        expect(screen.queryByText('Primary background color:').firstElementChild.innerHTML).toBe('red'); // The processed value changes
        expect(screen.queryByText('Secondary font color:').firstElementChild.innerHTML).toBe('red'); // The processed value changes
        expect(screen.queryByText('Secondary background color:').firstElementChild.innerHTML).toBe('red'); // The processed value changes
        fireEvent.click(screen.queryByText(/^colors.secondaryBackground$/)); // close the editor
        expect(nodeColorsSecondaryBackground.nextSibling).toBeNull(); // editor closed
    });

    /**
     * Goal: Check that multiple referencing of the same value works.
     * 1.
     * - Clicks on 'colors.primary' to open the editor
     * - Enters '{colors.highlight2}'
     * - Click button 'OK'
     * - value changes to #ffab40
     * - Clicks on 'colors.primary' to close the editor
     *
     * 2. Ditto for 'colors.primaryBackground' -> '{colors.highlight2}'
     * 3. Ditto for 'colors.secondary' -> '{colors.highlight2}'
     * 4. Ditto for 'colors.highlight2' -> 'yellow'
     *
     * All 4 values should update to 'yellow'.
     */
    test('Multiple referencing works', () => {
        render(<Outline />);

        // 1.
        const nodeColorsPrimary = screen.queryByText(/^colors.primary$/);
        expect(nodeColorsPrimary.nextSibling).toBeNull();
        fireEvent.click(screen.queryByText(/^colors.primary$/)); // Click on 'colors.primary'
        expect(nodeColorsPrimary.nextSibling.nodeName).toEqual('SPAN'); // Closing 'x' exists
        let textbox = nodeColorsPrimary.parentNode.nextSibling.firstChild.childNodes[1];
        fireEvent.change(textbox, { target: { value: '{colors.highlight2}' } }); // write in textbox
        fireEvent.click(screen.queryByText('OK')); // click on button 'OK'
        expect(textbox.value).toBe('{colors.highlight2}');
        expect(screen.queryByText('Primary font color:').firstElementChild.innerHTML).toBe('#ffab40'); // The processed value changes
        fireEvent.click(screen.queryByText(/^colors.primary$/)); // close the editor
        expect(nodeColorsPrimary.nextSibling).toBeNull(); // editor closed

        // 2.
        const nodeColorsPrimaryBackground = screen.queryByText(/^colors.primaryBackground$/);
        expect(nodeColorsPrimaryBackground.nextSibling).toBeNull();
        fireEvent.click(screen.queryByText(/^colors.primaryBackground$/)); // Click on 'colors.primaryBackground'
        expect(nodeColorsPrimaryBackground.nextSibling.nodeName).toEqual('SPAN'); // Closing 'x' exists
        textbox = nodeColorsPrimaryBackground.parentNode.nextSibling.firstChild.childNodes[1];
        fireEvent.change(textbox, { target: { value: '{colors.highlight2}' } }); // write in textbox
        fireEvent.click(screen.queryByText('OK')); // click on button 'OK'
        expect(textbox.value).toBe('{colors.highlight2}');
        expect(screen.queryByText('Primary font color:').firstElementChild.innerHTML).toBe('#ffab40'); // The processed value changes
        expect(screen.queryByText('Primary background color:').firstElementChild.innerHTML).toBe('#ffab40'); // The processed value changes
        fireEvent.click(screen.queryByText(/^colors.primaryBackground$/)); // close the editor
        expect(nodeColorsPrimaryBackground.nextSibling).toBeNull(); // editor closed

        // 3.
        const nodeColorsSecondary = screen.queryByText(/^colors.secondary$/);
        expect(nodeColorsSecondary.nextSibling).toBeNull();
        fireEvent.click(screen.queryByText(/^colors.secondary$/)); // Click on 'colors.secondary'
        expect(nodeColorsSecondary.nextSibling.nodeName).toEqual('SPAN'); // Closing 'x' exists
        textbox = nodeColorsSecondary.parentNode.nextSibling.firstChild.childNodes[1];
        fireEvent.change(textbox, { target: { value: '{colors.highlight2}' } }); // write in textbox
        fireEvent.click(screen.queryByText('OK')); // click on button 'OK'
        expect(textbox.value).toBe('{colors.highlight2}');
        expect(screen.queryByText('Primary font color:').firstElementChild.innerHTML).toBe('#ffab40'); // The processed value changes
        expect(screen.queryByText('Primary background color:').firstElementChild.innerHTML).toBe('#ffab40'); // The processed value changes
        expect(screen.queryByText('Secondary font color:').firstElementChild.innerHTML).toBe('#ffab40'); // The processed value changes
        fireEvent.click(screen.queryByText(/^colors.secondary$/)); // close the editor
        expect(nodeColorsSecondary.nextSibling).toBeNull(); // editor closed

        // 4.
        const nodeColorsSecondaryBackground = screen.queryByText(/^colors.highlight2$/);
        expect(nodeColorsSecondaryBackground.nextSibling).toBeNull();
        fireEvent.click(screen.queryByText(/^colors.highlight2$/)); // Click on 'colors.secondary'
        expect(nodeColorsSecondaryBackground.nextSibling.nodeName).toEqual('SPAN'); // Closing 'x' exists
        textbox = nodeColorsSecondaryBackground.parentNode.nextSibling.firstChild.childNodes[1];
        fireEvent.change(textbox, { target: { value: 'yellow' } }); // write in textbox
        fireEvent.click(screen.queryByText('OK')); // click on button 'OK'
        expect(textbox.value).toBe('yellow');
        expect(screen.queryByText('Primary font color:').firstElementChild.innerHTML).toBe('yellow'); // The processed value changes
        expect(screen.queryByText('Primary background color:').firstElementChild.innerHTML).toBe('yellow'); // The processed value changes
        expect(screen.queryByText('Secondary font color:').firstElementChild.innerHTML).toBe('yellow'); // The processed value changes
        expect(screen.queryByText('Highlight on secondary background:').firstElementChild.innerHTML).toBe('yellow'); // The processed value changes
        fireEvent.click(screen.queryByText(/^colors.highlight2$/)); // close the editor
        expect(nodeColorsSecondaryBackground.nextSibling).toBeNull(); // editor closed
    });
});
