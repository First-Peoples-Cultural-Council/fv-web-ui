import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary SongsPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function SongsPresentation({ exampleProp }) {
  return <div className="Songs">SongsPresentation: {exampleProp}</div>
}
// PROPTYPES
const { string } = PropTypes
SongsPresentation.propTypes = {
  exampleProp: string,
}

export default SongsPresentation
