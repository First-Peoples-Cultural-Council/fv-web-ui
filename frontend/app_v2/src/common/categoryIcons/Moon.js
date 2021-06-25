import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary Moon
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function Moon({ styling }) {
  return (
    <svg className={styling} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 317 317" stroke="currentColor">
      <title>Moon</title>
      <path d="M167 0c-48 15-82 59-82 112 0 65 52 117 117 117 55 0 101-38 114-89 11 94-63 177-158 177C71 317 0 246 0 158 0 67 76-5 167 0z" />
    </svg>
  )
}
// PROPTYPES
const { string } = PropTypes
Moon.propTypes = {
  styling: string,
}

export default Moon
