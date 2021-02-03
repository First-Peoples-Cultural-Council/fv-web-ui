import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary HamburgerMenuIcon
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function HamburgerMenuIcon({ styling }) {
  return (
    <svg className={styling} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <title>Open menu</title>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}
// PROPTYPES
const { string } = PropTypes
HamburgerMenuIcon.propTypes = {
  styling: string,
}

export default HamburgerMenuIcon
