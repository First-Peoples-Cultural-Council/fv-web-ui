import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary LoginIcon
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function LoginIcon({ styling }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      enableBackground="new 0 0 24 24"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      className={styling}
    >
      <g>
        <rect fill="none" height="24" width="24" />
      </g>
      <g>
        <path d="M11,7L9.6,8.4l2.6,2.6H2v2h10.2l-2.6,2.6L11,17l5-5L11,7z M20,19h-8v2h8c1.1,0,2-0.9,2-2V5c0-1.1-0.9-2-2-2h-8v2h8V19z" />
      </g>
    </svg>
  )
}
// PROPTYPES
const { string } = PropTypes
LoginIcon.propTypes = {
  styling: string,
}

export default LoginIcon
