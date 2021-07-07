import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary Categories
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function Categories({ styling }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={styling}>
      <title>Category</title>
      <path d="M29 11v14a4 4 0 01-4 4H11a4 4 0 01-4-4V11a4 4 0 014-4h14a4 4 0 014 4zm24-4H39a4 4 0 00-4 4v14a4 4 0 004 4h14a4 4 0 004-4V11a4 4 0 00-4-4zM25 35H11a4 4 0 00-4 4v14a4 4 0 004 4h14a4 4 0 004-4V39a4 4 0 00-4-4zm21 0a11 11 0 1011 11 11 11 0 00-11-11z" />
    </svg>
  )
}
// PROPTYPES
const { string } = PropTypes
Categories.propTypes = {
  styling: string,
}

export default Categories
