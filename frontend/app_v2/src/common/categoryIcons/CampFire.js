import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary CampFire
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function CampFire({ styling }) {
  return (
    <svg className={styling} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" stroke="currentColor">
      <title>CampFire</title>
      <path d="M78.4 84.7l-11.7-5.1 11.7-5.1c3.4-1.5 4.9-5.4 3.5-8.8-1.5-3.4-5.4-4.9-8.8-3.5L50 72.4l-23.1-10c-3.4-1.5-7.3.1-8.8 3.5-1.5 3.4.1 7.3 3.5 8.8l11.7 5.1-11.7 5.1c-3.4 1.5-4.9 5.4-3.5 8.8 1.1 2.5 3.5 4 6.1 4 .9 0 1.8-.2 2.6-.6l23.1-10 23.1 10c.9.4 1.8.6 2.6.6 2.6 0 5-1.5 6.1-4 1.6-3.6.1-7.5-3.3-9z" />
      <path d="M32.5 57.4c2.9 2.4 6.2 4 9.8 4.7.3.1.5-.3.2-.5-7.2-6.7-1.9-16.3-.6-18.2 1.3-1.9 4.3-5.5 4.1-10.7 0-.5.5-.9.9-.7 3.9 2 6.7 6.7 7.4 10.3 1.1-1.1 1.5-2.9 1.5-4.5 0-.6.6-.9 1.1-.5 3.7 3.5 10.1 14.9-.2 24-.2.2 0 .6.3.5 3-.9 5.9-2.2 8.4-4.2 16.8-13.2 5.9-36.7-1.3-44.4-.9-1-2.6-.3-2.6 1-.1 2.8-.9 5.9-3.1 7.9-1.4-7-6.9-15.7-14.8-19.7-1-.5-2.2.3-2.2 1.4.2 9.6-6 16.5-11.4 24.5-4.6 7.5-7.7 20.5 2.5 29.1z" />
    </svg>
  )
}
// PROPTYPES
const { string } = PropTypes
CampFire.propTypes = {
  styling: string,
}

export default CampFire
