import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary CircleImagePresentation
 * @version 1.0.0
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function CircleImagePresentation({ src, alt, classNameWidth, classNameHeight }) {
  return (
    <span className={`inline-block rounded-full overflow-hidden ${classNameWidth} ${classNameHeight}`}>
      <img src={src} alt={alt} />
    </span>
  )
}
// PROPTYPES
const { string } = PropTypes
CircleImagePresentation.propTypes = {
  src: string,
  alt: string,
  classNameWidth: string,
  classNameHeight: string,
}
CircleImagePresentation.defaultProps = {
  alt: '',
  classNameWidth: 'w-24',
  classNameHeight: 'h-24',
}

export default CircleImagePresentation
