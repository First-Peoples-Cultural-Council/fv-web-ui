import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary PlaceHolderIcon
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function PlaceHolderIcon({ styling }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className={styling}>
      <rect width="100" height="100" rx="10" ry="10" fill="none" />
    </svg>
  )
}
// PROPTYPES
const { string } = PropTypes
PlaceHolderIcon.propTypes = {
  styling: string,
}

export default PlaceHolderIcon
