import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary ContactUsPresentation
 * @version 1.0.0
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ContactUsPresentation({ exampleProp }) {
  return <div className="ContactUs">ContactUsPresentation: {exampleProp}</div>
}
// PROPTYPES
const { string } = PropTypes
ContactUsPresentation.propTypes = {
  exampleProp: string,
}

export default ContactUsPresentation
