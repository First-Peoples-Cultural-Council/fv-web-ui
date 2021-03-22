import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary Copy
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function Copy({ styling }) {
  return (
    <svg className={styling} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <title>Copy</title>
      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
    </svg>
  )
}
// PROPTYPES
const { string } = PropTypes
Copy.propTypes = {
  styling: string,
}

export default Copy
