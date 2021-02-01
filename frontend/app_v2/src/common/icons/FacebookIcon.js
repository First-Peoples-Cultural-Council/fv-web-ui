import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary FacebookIcon - blue #4460A0
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function FacebookIcon({ styling }) {
  return (
    <svg viewBox="0 0 25 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className={styling}>
      <title>Share on Facebook</title>
      <path d="M25 0v8h-5c-3 0-4 2-4 4v5h8l-1 9h-7v22H7V26H0v-9h7v-6C7 4 12 0 18 0h7z" />
    </svg>
  )
}
// PROPTYPES
const { string } = PropTypes
FacebookIcon.propTypes = {
  styling: string,
}

export default FacebookIcon
