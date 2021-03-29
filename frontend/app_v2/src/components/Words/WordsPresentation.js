import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary WordsPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function WordsPresentation({ exampleProp }) {
  return <div className="Words">WordsPresentation: {exampleProp}</div>
}
// PROPTYPES
const { string } = PropTypes
WordsPresentation.propTypes = {
  exampleProp: string,
}

export default WordsPresentation
