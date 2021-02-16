import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary CircleImagePresentation
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
  /** Url to image */
  src: string.isRequired,
  /** Alt text for image */
  alt: string.isRequired,
  /** Change the width using Tailwind CSS class, eg: `classNameWidth="w-56 lg:w-72"` */
  classNameWidth: string,
  /** Change the height using Tailwind CSS class, eg: `classNameHeight="h-56 lg:h-72"` */
  classNameHeight: string,
}
CircleImagePresentation.defaultProps = {
  classNameWidth: 'w-24',
  classNameHeight: 'h-24',
}

export default CircleImagePresentation
