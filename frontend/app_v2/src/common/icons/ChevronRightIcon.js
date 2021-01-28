import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary ChevronRightIcon
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ChevronRightIcon({ styling }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className={styling}>
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    </svg>
  )
}
// PROPTYPES
const { string } = PropTypes
ChevronRightIcon.propTypes = {
  styling: string,
}

export default ChevronRightIcon
