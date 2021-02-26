import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary WordPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function WordPresentation({ exampleProp }) {
  return <div className="Word">WordPresentation: {exampleProp}</div>
}
// PROPTYPES
const { string } = PropTypes
WordPresentation.propTypes = {
  exampleProp: string,
}

export default WordPresentation
