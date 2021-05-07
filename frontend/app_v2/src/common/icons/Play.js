import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary Play
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function Play({ styling }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={styling}>
      <path d="M84.2,43.6L24.4,3.8c-5.1-3.4-12,0.3-12,6.4v79.5c0,6.2,6.9,9.8,12,6.4l59.8-39.8C88.7,53.4,88.7,46.6,84.2,43.6z" />
    </svg>
  )
}
// PROPTYPES
const { string } = PropTypes
Play.propTypes = {
  styling: string,
}

export default Play
