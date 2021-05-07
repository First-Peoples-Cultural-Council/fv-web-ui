import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary Exclamation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function Exclamation({ styling }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={styling}>
      <path d="M50,5C25.2,5,5,25.2,5,50s20.2,45,45,45s45-20.2,45-45S74.8,5,50,5z M50,86c-19.9,0-36-16.1-36-36  s16.1-36,36-36s36,16.1,36,36S69.9,86,50,86z" />
      <circle cx="50" cy="72.5" r="4.5" />
      <path d="M49.4,24.7c-3.7,0.3-6.5,3.6-6.2,7.3l2.3,27c0.2,2.2,1.9,3.9,4.1,4.1c2.5,0.2,4.7-1.6,4.9-4.1l2.3-27  c0-0.4,0-0.8,0-1.1C56.4,27.1,53.2,24.4,49.4,24.7z" />
    </svg>
  )
}
// PROPTYPES
const { string } = PropTypes
Exclamation.propTypes = {
  styling: string,
}

export default Exclamation
