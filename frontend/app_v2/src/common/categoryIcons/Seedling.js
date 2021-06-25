import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary Seedling
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function Seedling({ styling }) {
  return (
    <svg className={styling} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" stroke="currentColor">
      <title>Seedling</title>
      <path d="M93.6 7.9c-8.2.9-23.9 3.3-30.3 8.6-6.5 5.3-7.8 11-6 16.3 3.2-2 10.5-6.3 18.2-7.6-6.4 4-17.8 12.7-27.2 27.7-6.9-11.6-17.5-18.1-24.1-21.3 8.1.7 16.2 4.9 19.6 6.8 1.5-5.4-.1-11-6.8-16-6.7-4.9-22.5-6.5-30.7-7-2.5-.1-4.4 2.4-3.5 4.8 3 7.7 9.2 22.2 16 27.2 7 5.1 13.1 4.7 17.8 1.3 5.7 6 10.6 14.4 11.7 26.1-12.9.8-22.9 6-22.9 12.2 0 6.8 53 6.8 53 0 0-6.3-10.2-11.5-23.3-12.3-.4-5.4-1.6-10.2-3.2-14.5 4-7.2 8.6-13 13.1-17.6 4.9 3.2 11 3.3 17.8-2.2 6.5-5.3 12-20.1 14.5-28 .8-2.4-1.2-4.8-3.7-4.5z" />
    </svg>
  )
}
// PROPTYPES
const { string } = PropTypes
Seedling.propTypes = {
  styling: string,
}

export default Seedling
