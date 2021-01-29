import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary ChevronDownIcon
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ChevronDownIcon({ styling }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className={styling}>
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
    </svg>
  )
}
// PROPTYPES
const { string } = PropTypes
ChevronDownIcon.propTypes = {
  styling: string,
}

export default ChevronDownIcon
