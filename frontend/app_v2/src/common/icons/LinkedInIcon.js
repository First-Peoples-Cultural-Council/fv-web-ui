import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary LinkedInIcon - blue #007EBB
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function LinkedInIcon({ styling }) {
  return (
    <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className={styling}>
      <title>Share on LinkedIn</title>
      <path d="M52 52H41V34c0-5-2-8-6-8s-6 3-6 8v18H19V17h10v5s3-6 10-6c8 0 13 5 13 14v22zM6 13c-3 0-6-3-6-7 0-3 3-6 6-6 4 0 7 3 7 6 0 4-3 7-7 7zM1 52h11V17H1v35z" />
    </svg>
  )
}
// PROPTYPES
const { string } = PropTypes
LinkedInIcon.propTypes = {
  styling: string,
}

export default LinkedInIcon
