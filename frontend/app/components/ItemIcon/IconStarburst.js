import React from 'react'
import PropTypes from 'prop-types'
import '!style-loader!css-loader!./IconStarburst.css'
/**
 * @summary IconStarburst
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function IconStarburst({ className }) {
  return (
    <svg
      className={`IconStarburst ${className ? className : ''}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 17.522 20.233"
    >
      <path
        className="IconStarburst__bg"
        d="M179.045,50.966l2.529,5.736,6.232-.678-3.7,5.058,3.7,5.058-6.232-.677L179.045,71.2l-2.529-5.736-6.232.677,3.7-5.058-3.7-5.058,6.232.678Z"
        transform="translate(-170.284 -50.966)"
      />
    </svg>
  )
}

// PROPTYPES
const { string } = PropTypes
IconStarburst.propTypes = {
  className: string,
}

export default IconStarburst
