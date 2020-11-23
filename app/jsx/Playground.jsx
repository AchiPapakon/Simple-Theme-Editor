import React from 'react';
import { PropTypes } from 'prop-types';
import { getStyle } from '../js/Helper';
import { buttonStyle, textfieldStyle, linkStyle } from './Styles.jsx';

require('../css/Playground.sass');

/**
 * Returns the area where all the theme changes are applied to.
 * @param {Object} attributes The object 'attributes', which contains all the objects 'attribute'.
 */
const Playground = ({ attributes }) => {
    const highlight1 = (
        <span style={{ backgroundColor: getStyle(attributes.colors.highlight1) }}>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </span>
    );
    const highlight2 = (
        <span style={{ backgroundColor: getStyle(attributes.colors.highlight2) }}>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </span>
    );
    return (
        <div className="playground" style={{ backgroundColor: getStyle(attributes.colors.primaryBackground) }}>
            <div className="playgroundContent">
                <div style={{ fontSize: getStyle(attributes.sizes.text), color: getStyle(attributes.colors.primary) }}>
                    <h1 style={{ fontSize: getStyle(attributes.sizes.h1) }}>Header 1</h1>
                    <h2 style={{ fontSize: getStyle(attributes.sizes.h2) }}>Header 2</h2>
                    <p>Example link: <a href="#" style={linkStyle(attributes.links)}>Click here</a></p>
                    <p>
                        Primary: Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. {highlight1} Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </div>
                <p style={{ fontSize: getStyle(attributes.sizes.text), backgroundColor: getStyle(attributes.colors.secondaryBackground), color: getStyle(attributes.colors.secondary) }}>
                    Secondary: Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. {highlight2} Duis aute irure dolor in
                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <textarea
                    className="textfield"
                    defaultValue="Lorem ipsum dolor sit amet"
                    style={textfieldStyle(attributes.textfield)}
                />
                <button
                    className="buttonPlaceholder"
                    type="button"
                    style={buttonStyle(attributes.buttons)}
                >
                    Placeholder
                </button>
            </div>
        </div>
    );
};
Playground.propTypes = {
    attributes: PropTypes.object.isRequired
};

export default Playground;
