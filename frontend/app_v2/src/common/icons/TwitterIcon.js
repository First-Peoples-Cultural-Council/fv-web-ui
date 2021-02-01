import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary TwitterIcon  - Twitter blue #4DC8F1
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function TwitterIcon({ styling }) {
  return (
    <svg viewBox="0 0 48 39" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className={styling}>
      <title>Share on Twitter</title>
      <path d="M43 9.7A27.9 27.9 0 010 34.6c5.2.6 10.4-.8 14.6-4-4.3-.2-8-3-9.2-7 1.5.4 3 .3 4.4-.1-4.7-1-8-5.2-7.9-9.8 1.4.8 2.9 1.2 4.5 1.2a9.9 9.9 0 01-3-13.1 28 28 0 0020.2 10.3 9.9 9.9 0 0116.8-9c2.3-.4 4.4-1.3 6.3-2.4a9.9 9.9 0 01-4.4 5.5c2-.3 4-.8 5.7-1.6a20 20 0 01-5 5.1" />
    </svg>
  )
}
// PROPTYPES
const { string } = PropTypes
TwitterIcon.propTypes = {
  styling: string,
}

export default TwitterIcon
