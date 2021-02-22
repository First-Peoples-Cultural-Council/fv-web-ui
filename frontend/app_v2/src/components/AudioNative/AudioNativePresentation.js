import React, { useRef } from 'react'
import PropTypes from 'prop-types'
/**
 * @summary AudioNativePresentation
 * @component
 */
function AudioNativePresentation({ src, className, onAudioNativePlay }) {
  const audioRef = useRef()

  return <audio ref={audioRef} className={className} src={src} controls onPlay={() => onAudioNativePlay(audioRef)} />
}
// PROPTYPES
const { func, string } = PropTypes
AudioNativePresentation.propTypes = {
  /** Audio src url */
  src: string,
  /** Styling for audio player e.g. "w-7/12 text-black mx-auto" */
  className: string,
  /** onPlay event handler  */
  onAudioNativePlay: func,
}
AudioNativePresentation.defaultProps = {
  onAudioNativePlay: () => {},
}

export default AudioNativePresentation
