import React, { useRef } from 'react';
import { PropTypes } from 'prop-types';
import InlineEditor from './InlineEditor.jsx';
import Playground from './Playground.jsx';
import { parseAttributes } from '../js/Helper';

require('../css/SimpleThemeEditor.sass');

/**
 * Checks if the 'type' is one of four values and throws an error otherwise.
 * @param {string} type Type of the value
 */
const AttributeType = (type) => {
    const types = ['text', 'em', 'px', 'color'];
    if (!types.includes(type)) {
        throw new Error('AttributeType should be on of the following:', types);
    }
    return type;
};

/**
 * Returns the object 'attribute'
 * @param {string} label The user-friendly label of the attribute
 * @param {string} value The final value to be shown to the user
 * @param {string} type The type of the value
 * @param {string} reference The reference of this attribute e.g. 'textfield.border'
 */
const Attribute = (label, value, type, reference) => ({
    label, // e.g. 'Border'
    value, // e.g. '1px solid #000000'
    type, // e.g. 'text'
    reference, // e.g. 'textfield.border'
    userInput: value // The textbox content
});

/**
 * Returns the group object 'attribute'
 * @param {string} title The title of the Group
 * @param {bool} isExpanded Default expansion value
 */
const AttributeGroupTitles = (title, isExpanded) => ({
    title,
    isExpanded
});

const defaultAttributes = {
    colors: {
        primary: Attribute('Primary font color', '#000000', AttributeType('color'), 'colors.primary'),
        primaryBackground: Attribute('Primary background color', '#ffffff', AttributeType('color'), 'colors.primaryBackground'),
        secondary: Attribute('Secondary font color', '#ffffff', AttributeType('color'), 'colors.secondary'),
        secondaryBackground: Attribute('Secondary background color', '#4a86e8', AttributeType('color'), 'colors.secondaryBackground'),
        highlight1: Attribute('Highlight on primary background', '#4a86e8', AttributeType('color'), 'colors.highlight1'),
        highlight2: Attribute('Highlight on secondary background', '#ffab40', AttributeType('color'), 'colors.highlight2')
    },
    sizes: {
        text: Attribute('Default text size (em)', '1.1', AttributeType('em'), 'sizes.text'),
        h1: Attribute('Header1 text size (em)', '1.4', AttributeType('em'), 'sizes.h1'),
        h2: Attribute('Header2 text size (em)', '1.2', AttributeType('em'), 'sizes.h2'),
        borderWidth: Attribute('Default border width (px)', '1', AttributeType('px'), 'sizes.borderWidth'),
    },
    textfield: {
        textSize: Attribute('Text size (em)', '1.1', AttributeType('em'), 'textfield.textSize'),
        color: Attribute('Font color', '#000000', AttributeType('color'), 'textfield.color'),
        border: Attribute('Border', '1px solid #000000', AttributeType('text'), 'textfield.border'),
        background: Attribute('Background', '#ffffff', AttributeType('color'), 'textfield.background')
    },
    buttons: {
        fontSize: Attribute('Font size (em)', 'calc(1.1*1.2)', AttributeType('em'), 'buttons.fontSize'),
        color: Attribute('Font color', '#000000', AttributeType('color'), 'buttons.color'),
        background: Attribute('Background', '#4a86e8', AttributeType('color'), 'buttons.background')
    },
    links: {
        fontSize: Attribute('Font size (em)', '1.1', AttributeType('em'), 'links.fontSize'),
        fontColor: Attribute('Font color', '#007bff', AttributeType('color'), 'links.fontColor')
    }
};

const defaultAttributeGroupTitles = {
    colors: AttributeGroupTitles('General colors', true),
    sizes: AttributeGroupTitles('Global sizes', true),
    textfield: AttributeGroupTitles('Text field', true),
    buttons: AttributeGroupTitles('Buttons', true),
    links: AttributeGroupTitles('Links', true)
};

/**
 * Retrieves localeStorage memory for key 'localStorageState'
 * It contains the keys 'isInlineEditorActive', 'attributes' and 'attributeGroupTitles'
 */
const getLocalStorageState = () => {
    let isInlineEditorActive;
    let attributes;
    let attributeGroupTitles;
    const localStorageState = JSON.parse(localStorage.getItem('localStorageState'));
    if (localStorageState) {
        isInlineEditorActive = localStorageState.isInlineEditorActive;
        attributes = localStorageState.attributes;
        attributeGroupTitles = localStorageState.attributeGroupTitles;
    } else {
        // If localStorage is empty, then retrieve the default values.
        isInlineEditorActive = false;
        attributes = defaultAttributes;
        attributeGroupTitles = defaultAttributeGroupTitles;
    }
    return {
        isInlineEditorActive,
        attributes,
        attributeGroupTitles
    };
};

/**
 * The main component of the application.
 */
export default class Outline extends React.Component {
    constructor(props) {
        super(props);

        if (typeof Storage === 'undefined') {
            console.log('No local storage support!');
        }

        // Retrieve localeStorage memory
        const { isInlineEditorActive, attributes, attributeGroupTitles } = getLocalStorageState();

        this.state = {
            isInlineEditorActive,
            attributes,
            attributeGroupTitles
        };
    }

    /**
     * Handles the action when the user clicks on a attribute to change it.
     * @param {object} e Event
     * @param {string} reference The attribute reference e.g. "colors.primary"
     */
    handleThemeElementClick(e, reference) {
        const { isInlineEditorActive, attributes } = this.state;
        const [property1, property2] = reference.split('.');
        if (isInlineEditorActive && !attributes[property1][property2].showInlineEditor) {
            return;
        }

        this.setState((state) => ({
            ...state,
            isInlineEditorActive: !state.isInlineEditorActive,
            attributes: {
                ...state.attributes,
                [property1]: {
                    ...state.attributes[property1],
                    [property2]: {
                        ...state.attributes[property1][property2],
                        showInlineEditor: !state.attributes[property1][property2].showInlineEditor
                    }
                }
            }
        }));
    }

    /**
     * Handles the action when the user presses a key while focusing on a attribute's title row.
     * If it's 'Enter', then it's the same as clicking on  it,
     * if it's 'Escape', then it closes the inline editor
     * @param {object} e Event
     * @param {string} reference The attribute reference e.g. "colors.primary"
     */
    handleElementKeyDown(e, reference) {
        if (e.key === 'Enter') {
            this.handleThemeElementClick(e, reference);
        } else if (e.key === 'Escape') {
            const [property1, property2] = reference.split('.');

            this.setState((state) => ({
                ...state,
                isInlineEditorActive: false,
                attributes: {
                    ...state.attributes,
                    [property1]: {
                        ...state.attributes[property1],
                        [property2]: {
                            ...state.attributes[property1][property2],
                            showInlineEditor: false
                        }
                    }
                }
            }));
        }
    }

    /**
     * When the user clicks on a group attribute title, then expand its attributes.
     * @param {object} e Event
     * @param {string} titleProperty The group attribute name e.g. "colors"
     */
    handleAttributeGroupTitleClick(e, titleProperty) {
        const { isInlineEditorActive } = this.state;
        if (isInlineEditorActive) {
            return;
        }

        this.setState((state) => ({
            ...state,
            attributeGroupTitles: {
                ...state.attributeGroupTitles,
                [titleProperty]: {
                    ...state.attributeGroupTitles[titleProperty],
                    isExpanded: !state.attributeGroupTitles[titleProperty].isExpanded
                }
            }
        }));
    }

    /**
     * When the user presses the key 'Enter' while focusing on a group attribute title, then
     * call the method that handles as if the user has clicked on it.
     * @param {object} e Event
     * @param {string} titleProperty The attribute property e.g. "colors"
     */
    handleAttributeGroupTitleKeyDown(e, titleProperty) {
        if (e.key === 'Enter') {
            this.handleAttributeGroupTitleClick(e, titleProperty);
        }
    }

    /**
     * When the user clicks on the button 'Save' then
     * pass the state's keys 'isInlineEditorActive', 'attributes', 'attributeGroupTitles'
     * to the local storage key 'localStorageState'
     */
    handleSaveClick() {
        const { isInlineEditorActive, attributes, attributeGroupTitles } = this.state;
        localStorage.setItem('localStorageState', JSON.stringify({ isInlineEditorActive, attributes, attributeGroupTitles }));
    }

    /**
     * Clears the localStorage and updates the state.
     * After this method, the localStorage will be empty.
     */
    handleResetClick() {
        localStorage.clear();
        this.setState({
            attributes: defaultAttributes,
            attributeGroupTitles: defaultAttributeGroupTitles,
            isInlineEditorActive: false
        });
    }

    /**
     * Handles the value change of the inline editor textbox.
     * @param {string} inputValue The textbox' input string
     * @param {string} reference The attribute reference e.g. "colors.primary"
     */
    updateValue(inputValue, reference) {
        const { attributes } = this.state;
        const [property1, property2] = reference.split('.');
        let value = inputValue;

        // Finds all the {references} and replaces them by the state's value.
        value = value.replace(/{(\w+\.\w+)}/g, (str, p1) => {
            const matchReference = p1;
            const [matchProperty1, matchProperty2] = matchReference.split('.');
            return attributes[matchProperty1][matchProperty2].value;
        });
        // console.log('Replaced value:', value);

        const { state } = this;
        let newState = {
            ...state,
            attributes: {
                ...state.attributes,
                [property1]: {
                    ...state.attributes[property1],
                    [property2]: {
                        ...state.attributes[property1][property2],
                        value, // Assign the replaced value
                        userInput: inputValue // Keep the textbox value
                    }
                }
            }
        };

        newState = parseAttributes(newState, reference);

        // console.log('newState:', newState);
        this.setState({
            attributes: newState.attributes
        });
    }

    /**
     * Returns the attribute theme element.
     * @param {string} reference The attribute's reference e.g. 'colors.primary'
     */
    createThemeElement(reference) {
        const { isInlineEditorActive, attributes } = this.state;
        return (
            <ThemeElement
                isInlineEditorActive={isInlineEditorActive}
                attributes={attributes}
                reference={reference}
                updateValue={(e) => this.updateValue(e, reference)}
                handleThemeElementClick={(e) => this.handleThemeElementClick(e, reference)}
                handleElementKeyDown={(e) => this.handleElementKeyDown(e, reference)}
                key={reference}
            />
        );
    }

    /**
     * Returns the attribute group with its children elements
     * @param {string} titleProperty e.g. 'colors'
     * @param {Array<string>} references e.g. ['colors.primary', 'colors.primaryBackground']
     */
    createAttributeGroup(titleProperty, references) {
        const { attributeGroupTitles } = this.state;
        const { title, isExpanded } = attributeGroupTitles[titleProperty];
        const themeElements = references.map((reference) => this.createThemeElement(reference));
        return (
            <div className="attributeGroup">
                <span><i className={`arrow ${isExpanded ? 'arrowDown' : 'arrowRight'}`} /></span>
                <div className="attributeGroupContents">
                    <div
                        className="attributeGroupTitle"
                        onClick={(e) => this.handleAttributeGroupTitleClick(e, titleProperty)}
                        role="button"
                        tabIndex="0"
                        onKeyDown={(e) => this.handleAttributeGroupTitleKeyDown(e, titleProperty)}
                    >
                        <h4>{title}</h4>
                    </div>
                    {isExpanded && themeElements}
                </div>
            </div>
        );
    }

    render() {
        const { attributes } = this.state;
        return (
            <div className="appContainer">
                {/* <MainComponent(s) /> */}
                <div className="simpleThemeEditorExterior">
                    <div className="simpleThemeEditor">
                        <h2 className="pageTitle">simple theme editor</h2>
                        {this.createAttributeGroup('colors',
                            ['colors.primary', 'colors.primaryBackground', 'colors.secondary', 'colors.secondaryBackground', 'colors.highlight1', 'colors.highlight2'])}
                        {this.createAttributeGroup('sizes',
                            ['sizes.text', 'sizes.h1', 'sizes.h2', 'sizes.borderWidth'])}
                        {this.createAttributeGroup('textfield',
                            ['textfield.textSize', 'textfield.color', 'textfield.border', 'textfield.background'])}
                        {this.createAttributeGroup('buttons',
                            ['buttons.fontSize', 'buttons.color', 'buttons.background'])}
                        {this.createAttributeGroup('links',
                            ['links.fontSize', 'links.fontColor'])}
                        <div className="simpleThemeEditorButtonBar">
                            <button className="saveButton" onClick={() => this.handleSaveClick()} type="button">Save</button>
                            <button className="resetButton" onClick={() => this.handleResetClick()} type="button">Reset</button>
                        </div>
                    </div>
                </div>
                <Playground attributes={attributes} />
            </div>
        );
    }
}

/**
 * Returns the attribute theme element
 * @param {bool} isInlineEditorActive Is the inline editor expanded?
 * @param {Object} attributes The object 'attributes', which contains all the objects 'attribute'
 * @param {string} reference The attribute's reference e.g. 'colors.primary'
 * @param {function} updateValue Calls the method to pass the 'value' of the attribute upwards
 * @param {function} handleThemeElementClick Calls the method when the user clicks on a attribute to change it
 * @param {function} handleElementKeyDown Calls the method when the user presses a key while focusing on a attribute's title row
 */
const ThemeElement = ({
    isInlineEditorActive,
    attributes,
    reference,
    updateValue,
    handleThemeElementClick,
    handleElementKeyDown
}) => {
    /**
     * Get the reference from the object attributes
     * e.g. if reference="textfield.border" then the path is attributes.textfield.border and attribute is the object.
     */
    const attribute = reference.split('.').reduce((acc, cur) => (acc && acc[cur]) || null, attributes); // Object 'attribute'
    const divColor = attribute.type === 'color' ? <div className="divColor" style={{ background: attribute.value }} /> : null;
    const editorElementLinkRef = useRef(null);
    return (
        <div className={(isInlineEditorActive && attribute.showInlineEditor) ? 'inlineEditorActive' : 'inlineEditorInactive'}>
            <div
                className={`editorElementLink ${isInlineEditorActive ? 'editorElementLinkActive' : ''}`}
                onClick={(e) => handleThemeElementClick(e, reference)}
                role="button"
                tabIndex="0"
                onKeyDown={(e) => handleElementKeyDown(e, reference)}
                ref={editorElementLinkRef}
            >
                <div className="leftHalf">
                    <div className="leftSideContents">
                        <span> {/* This span exists so we can copy & paste without a line break */}
                            {attribute.label}:
                            <span className="attributeValue">
                                {attribute.value}
                            </span>
                        </span>
                        {divColor}
                    </div>
                </div>
                <i>{attribute.reference}</i>
                {isInlineEditorActive && attribute.showInlineEditor && <span className="buttonX">x</span>}
            </div>
            {isInlineEditorActive && attribute.showInlineEditor && (
                <InlineEditor
                    attribute={attribute}
                    updateValue={(e) => updateValue(e, reference)}
                    editorElementLinkRef={editorElementLinkRef}
                />
            )}
        </div>
    );
};
ThemeElement.propTypes = {
    isInlineEditorActive: PropTypes.bool.isRequired,
    attributes: PropTypes.object.isRequired,
    reference: PropTypes.string.isRequired,
    updateValue: PropTypes.func.isRequired,
    handleThemeElementClick: PropTypes.func.isRequired,
    handleElementKeyDown: PropTypes.func.isRequired
};
