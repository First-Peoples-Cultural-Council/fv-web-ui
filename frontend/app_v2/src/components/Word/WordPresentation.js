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
function WordPresentation({ wordId }) {
  return <div className="Word">WordPresentation: {wordId}</div>
}
// PROPTYPES
const { string } = PropTypes
WordPresentation.propTypes = {
  wordId: string,
}

export default WordPresentation
