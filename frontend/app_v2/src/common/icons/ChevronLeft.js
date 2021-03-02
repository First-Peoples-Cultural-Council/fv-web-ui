import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary ChevronLeft
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ChevronLeft({ styling }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className={styling}>
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    </svg>
  )
}
// PROPTYPES
const { string } = PropTypes
ChevronLeft.propTypes = {
  styling: string,
}

export default ChevronLeft
