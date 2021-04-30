import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary SongPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function SongPresentation({ exampleProp }) {
  return <div className="Song">SongPresentation: {exampleProp}</div>
}
// PROPTYPES
const { string } = PropTypes
SongPresentation.propTypes = {
  exampleProp: string,
}

export default SongPresentation
