import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary TEMPLATEPresentation
 * @version 1.0.0
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function TEMPLATEPresentation({ exampleProp }) {
  return <div className="TEMPLATE">TEMPLATEPresentation: {exampleProp}</div>
}
// PROPTYPES
const { string } = PropTypes
TEMPLATEPresentation.propTypes = {
  exampleProp: string,
}

export default TEMPLATEPresentation
