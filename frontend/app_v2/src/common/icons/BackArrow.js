import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary BackArrow
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function BackArrow({ styling }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className={styling}>
      <title>BackArrow</title>
      <path d="M11.93,7.12V2.65a.66.66,0,0,0-.38-.59A.72.72,0,0,0,11.26,2a.66.66,0,0,0-.42.15L.25,10.64a.64.64,0,0,0-.25.5.64.64,0,0,0,.24.5l10.6,8.52a.66.66,0,0,0,.42.15.72.72,0,0,0,.29-.06.66.66,0,0,0,.38-.59V15.21c4.28,0,7.23.32,10.81,6.46a.68.68,0,0,0,.59.33l.17,0a.67.67,0,0,0,.5-.63v-.52C24,16.49,24.07,7.54,11.93,7.12Zm0,6.09h0a2,2,0,0,0-2,2v1.66L2.81,11.15,9.93,5.44V7.12a2,2,0,0,0,1.93,2c7.24.25,9.36,3.63,9.94,7.8C18.74,13.56,15.67,13.23,11.94,13.21Z" />
    </svg>
  )
}
// PROPTYPES
const { string } = PropTypes
BackArrow.propTypes = {
  styling: string,
}

export default BackArrow
