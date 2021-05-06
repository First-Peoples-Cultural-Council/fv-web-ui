import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary Pause
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function Pause({ styling }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="100px" width="100px" viewBox="0 0 100 100" className={styling}>
      <path d="M35.6,2.5H13.3c-2.1,0-3.9,1.7-3.9,3.9v87.3c0,2.1,1.7,3.9,3.9,3.9h22.2c2.1,0,3.9-1.7,3.9-3.9V6.4     C39.4,4.2,37.7,2.5,35.6,2.5z" />
      <path d="M86.7,2.5H64.4c-2.1,0-3.9,1.7-3.9,3.9v87.3c0,2.1,1.7,3.9,3.9,3.9h22.2c2.1,0,3.9-1.7,3.9-3.9V6.4     C90.5,4.2,88.8,2.5,86.7,2.5z" />
    </svg>
  )
}
// PROPTYPES
const { string } = PropTypes
Pause.propTypes = {
  styling: string,
}

export default Pause
