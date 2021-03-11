import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary PlayArrow
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function PlayArrow({ styling }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className={styling}>
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}
// PROPTYPES
const { string } = PropTypes
PlayArrow.propTypes = {
  styling: string,
}

export default PlayArrow
