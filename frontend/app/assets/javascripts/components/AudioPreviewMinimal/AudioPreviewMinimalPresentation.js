import React from 'react'
import PropTypes from 'prop-types'
import '!style-loader!css-loader!./AudioPreviewMinimal.css'

/**
 * @summary AudioPreviewMinimalPresentation
 * @version 1.0.1
 *
 * @component
 *
 * @prop {object} props
 * @prop {string} props.src URL for audio file
 *
 * @returns {node} jsx markup
 */
function AudioPreviewMinimalPresentation({
  src,
  onClick,
  isPlaying,
}) {
  return (
    <div className="AudioPreviewMinimal">
      <div onClick={onClick}>{`${src} ${isPlaying ? 'YES' : 'NO'}`}</div>
    </div>
  )
}
// PROPTYPES
const { array } = PropTypes
AudioPreviewMinimalPresentation.propTypes = {
  items: array,
}
AudioPreviewMinimalPresentation.defaultProps = {
}

export default AudioPreviewMinimalPresentation
