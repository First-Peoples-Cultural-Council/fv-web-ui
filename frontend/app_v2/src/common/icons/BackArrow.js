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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={styling}>
      <title>BackArrow</title>
      <g>
        <g>
          <path d="M5273.1,2400.1v-2c0-2.8-5-4-9.7-4s-9.7,1.3-9.7,4v2c0,1.8,0.7,3.6,2,4.9l5,4.9c0.3,0.3,0.4,0.6,0.4,1v6.4 c0,0.4,0.2,0.7,0.6,0.8l2.9,0.9c0.5,0.1,1-0.2,1-0.8v-7.2c0-0.4,0.2-0.7,0.4-1l5.1-5C5272.4,2403.7,5273.1,2401.9,5273.1,2400.1z      M5263.4,2400c-4.8,0-7.4-1.3-7.5-1.8v0c0.1-0.5,2.7-1.8,7.5-1.8c4.8,0,7.3,1.3,7.5,1.8C5270.7,2398.7,5268.2,2400,5263.4,2400z" />
          <path d="M5268.4,2410.3c-0.6,0-1,0.4-1,1c0,0.6,0.4,1,1,1h4.3c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H5268.4z" />
          <path d="M5272.7,2413.7h-4.3c-0.6,0-1,0.4-1,1c0,0.6,0.4,1,1,1h4.3c0.6,0,1-0.4,1-1C5273.7,2414.1,5273.3,2413.7,5272.7,2413.7z" />
          <path d="M5272.7,2417h-4.3c-0.6,0-1,0.4-1,1c0,0.6,0.4,1,1,1h4.3c0.6,0,1-0.4,1-1C5273.7,2417.5,5273.3,2417,5272.7,2417z" />
        </g>
        <path d="M97.5,88.7c0-22.6-21.8-53.7-49.4-58.8V11.3L2.5,45.1l45.6,33.8V60C67.4,62,84.6,71.2,97.5,88.7z" />
      </g>
    </svg>
  )
}
// PROPTYPES
const { string } = PropTypes
BackArrow.propTypes = {
  styling: string,
}

export default BackArrow
