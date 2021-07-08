import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary ChevronUp
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ChevronUp({ styling }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={styling}>
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
    </svg>
  )
}
// PROPTYPES
const { string } = PropTypes
ChevronUp.propTypes = {
  styling: string,
}

export default ChevronUp
