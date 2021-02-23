import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary CloseIcon
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function CloseIcon({ styling }) {
  return (
    <svg className={styling} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <title>Close</title>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
// PROPTYPES
const { string } = PropTypes
CloseIcon.propTypes = {
  styling: string,
}

export default CloseIcon
