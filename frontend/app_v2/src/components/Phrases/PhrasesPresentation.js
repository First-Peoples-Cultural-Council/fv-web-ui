import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary PhrasesPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function PhrasesPresentation({ exampleProp }) {
  return <div className="Phrases">PhrasesPresentation: {exampleProp}</div>
}
// PROPTYPES
const { string } = PropTypes
PhrasesPresentation.propTypes = {
  exampleProp: string,
}

export default PhrasesPresentation
