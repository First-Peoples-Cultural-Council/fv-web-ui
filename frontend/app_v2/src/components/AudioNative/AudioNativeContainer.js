import React from 'react'
import PropTypes from 'prop-types'
import AudioNativePresentation from './AudioNativePresentation'
import AudioNativeData from './AudioNativeData'
/**
 * @summary AudioNativeContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function AudioNativeContainer({ src, className }) {
  const { onAudioNativePlay } = AudioNativeData({ src })
  return <AudioNativePresentation src={src} className={className} onAudioNativePlay={onAudioNativePlay} />
}
// PROPTYPES
const { string } = PropTypes
AudioNativeContainer.propTypes = {
  src: string,
  className: string,
}

export default AudioNativeContainer
