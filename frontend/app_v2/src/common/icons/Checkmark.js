import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary Checkmark
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function Checkmark({ styling }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className={styling}>
      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
    </svg>
  )
}
// PROPTYPES
const { string } = PropTypes
Checkmark.propTypes = {
  styling: string,
}

export default Checkmark
