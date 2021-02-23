import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary DictionaryIcon
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function DictionaryIcon({ styling }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className={styling}>
      <path
        d="M21.98,22.77H2.74V1.39h15.77h3.46V22.77z M5.35,20.87h16.03v-2.26H5.35V20.87z M6.41,13.96h1.71l0.53-1.61
   h2.88l0.52,1.61h1.77l-2.77-7.82H9.21L6.41,13.96z M10.11,7.92L11.1,11h-2L10.11,7.92z M17.47,8.05c-0.42,0-0.77,0.09-1.05,0.27
   c-0.23,0.14-0.44,0.35-0.63,0.62V6.14h-1.51v7.81h1.49v-0.73c0.2,0.28,0.39,0.48,0.56,0.59c0.29,0.19,0.68,0.29,1.16,0.29
   c0.77,0,1.36-0.3,1.79-0.89c0.43-0.59,0.64-1.34,0.64-2.23c0-0.87-0.21-1.58-0.65-2.12C18.84,8.32,18.24,8.05,17.47,8.05z
    M17.09,12.87c-0.45,0-0.79-0.16-1.01-0.49s-0.33-0.74-0.33-1.23c0-0.42,0.05-0.76,0.16-1.03c0.21-0.5,0.59-0.75,1.14-0.75
   c0.54,0,0.92,0.25,1.12,0.76c0.11,0.27,0.16,0.61,0.16,1.02c0,0.51-0.11,0.93-0.33,1.24C17.79,12.71,17.48,12.87,17.09,12.87z"
      />
    </svg>
  )
}
// PROPTYPES
const { string } = PropTypes
DictionaryIcon.propTypes = {
  styling: string,
}

export default DictionaryIcon
