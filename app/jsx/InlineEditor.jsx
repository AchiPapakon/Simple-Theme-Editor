import React from 'react';
import PropTypes from 'prop-types';
import { isValidParentheses } from '../js/Helper';

require('../css/SimpleThemeEditor.sass');

/**
 * Returns the inline editor
 * @param {object} attribute The whole attribute object to be edited
 * @param {function} updateValue The function passing the value to the state upwards
 * @param {object} editorElementLinkRef The reference to the clickable attribute title, used for focus()
 */
export default class InlineEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentTextboxValue: props.attribute.userInput, // user's textbox input
            validationErrors: [] // The array of validation errors
        };

        this.textboxRef = React.createRef();
        this.inactivityTimer = null; // Handles the 300ms inactivity time
    }

    componentDidMount() {
        // When the component mounts, focus on the textbox
        this.textboxRef.current.focus();
    }

    componentWillUnmount() {
        // Clears the inactivity timer
        clearTimeout(this.inactivityTimer);
    }

    handleValueChange(e) {
        this.setState({
            currentTextboxValue: e.target.value
        });
    }

    /**
     * Checks for validation errors.
     * No strict validation is implemented (e.g. "1px solid black"), because CSS values can have a lot of cases,
     * like omitting some elements, or adding calc()
     * Rules:
     * - Checks if there are any open or misplaced parentheses, brackets or curly brackets.
     * - Checks if the user input references itself, which shouldn't happen.
     */
    handleValidationErrors() {
        const { attribute } = this.props;
        const { currentTextboxValue } = this.state;

        const validationErrors = [];
        if (!isValidParentheses(currentTextboxValue)) {
            validationErrors.push({ id: 0, text: 'Please check that all parentheses close properly.' });
        }
        if (currentTextboxValue.match(`{${attribute.reference}}`)) {
            validationErrors.push({ id: 1, text: 'Self-referencing is not allowed.' });
        }
        this.setState({
            validationErrors
        });
    }

    /**
     * When the user clicks on the button OK then
     * check for validation errors and send the 'value' to the parent component
     */
    handleOkClick() {
        const { attribute, updateValue } = this.props;
        const { currentTextboxValue, validationErrors } = this.state;

        this.handleValidationErrors();
        if (validationErrors.length > 0) {
            return;
        }

        updateValue(currentTextboxValue, attribute.reference);
    }

    /**
     * Clears the inactivity timer.
     * When the user presses 'Enter', then it's like they're pushing the button OK.
     * When the user presses 'Escape', then reset the textbox and move focus to the clickable attribute title.
     * Set the inactivity timer.
     * @param {Object} e Event object
     */
    handleTextboxKeyDown(e) {
        const { attribute, editorElementLinkRef } = this.props;
        clearTimeout(this.inactivityTimer);
        if (e.key === 'Enter') {
            this.handleOkClick();
        } else if (e.key === 'Escape') {
            this.setState({
                currentTextboxValue: attribute.userInput
            });
            editorElementLinkRef.current.focus();
        }
        this.inactivityTimer = setTimeout(() => this.handleValidationErrors(), 300);
    }

    render() {
        const { attribute } = this.props;
        const { currentTextboxValue, validationErrors } = this.state;
        const textBoxValidation = validationErrors.length > 0 ? { outline: 'auto 1px red' } : null;
        const validationErrorBullets = validationErrors.map((validationError) => <li key={validationError.id}>{validationError.text}</li>);
        const validationRow = (
            <div className="validationRow">
                <div className="errorContainer">
                    <strong>Errors:</strong>
                    <ul>
                        {validationErrorBullets}
                    </ul>
                </div>
            </div>
        );
        return (
            <div className="inlineEditor">
                <div className="valueRow">
                    <span className="leftSide">Value:</span>
                    <input
                        className="textbox"
                        style={textBoxValidation}
                        value={currentTextboxValue}
                        onChange={(e) => this.handleValueChange(e)}
                        onKeyDown={(e) => this.handleTextboxKeyDown(e)}
                        ref={this.textboxRef}
                    />
                </div>
                <div className="typeRow">
                    <div className="leftHalf">
                        <span className="leftSide">Type:</span>
                        <RadioLabel label="text" type={attribute.type} />
                        <RadioLabel label="em" type={attribute.type} />
                        <RadioLabel label="px" type={attribute.type} />
                        <RadioLabel label="color" type={attribute.type} />
                    </div>
                    <button className="okButton" type="button" onClick={() => this.handleOkClick()}>OK</button>
                </div>
                {validationErrors.length > 0 && validationRow}
            </div>
        );
    }
}
InlineEditor.propTypes = {
    attribute: PropTypes.object.isRequired,
    updateValue: PropTypes.func.isRequired,
    editorElementLinkRef: PropTypes.object.isRequired
};

/**
 * Returns a radio button with its label
 * @param {string} label The label of the radio button
 * @param {string} type The type of the current attribute e.g. "em"
 */
const RadioLabel = ({ label, type }) => (
    <label>
        <input type="radio" name="attributeTypes" value={label} checked={label === type} readOnly />
        <span className="radioLabel">{label}</span>
    </label>
);
RadioLabel.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
};
