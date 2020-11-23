import { getStyle } from '../js/Helper';

/**
 * Returns the theme button style
 * @param {Object} attributeGroup The attribute group object
 */
export const buttonStyle = (attributeGroup) => ({
    fontSize: getStyle(attributeGroup.fontSize),
    color: getStyle(attributeGroup.color),
    backgroundColor: getStyle(attributeGroup.background)
});

/**
 * Returns the theme textfield style
 * @param {Object} attributeGroup The attribute group object
 */
export const textfieldStyle = (attributeGroup) => ({
    fontSize: getStyle(attributeGroup.textSize),
    color: getStyle(attributeGroup.color),
    border: getStyle(attributeGroup.border),
    backgroundColor: getStyle(attributeGroup.background)
});

/**
 * Returns the theme link style
 * @param {Object} attributeGroup The attribute group object
 */
export const linkStyle = (attributeGroup) => ({
    fontSize: getStyle(attributeGroup.fontSize),
    color: getStyle(attributeGroup.fontColor)
});
