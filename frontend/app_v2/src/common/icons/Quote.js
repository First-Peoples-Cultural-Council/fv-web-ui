import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary Quote
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function Quote({ styling }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className={styling}>
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
    </svg>
  )
}
// PROPTYPES
const { string } = PropTypes
Quote.propTypes = {
  styling: string,
}

export default Quote
