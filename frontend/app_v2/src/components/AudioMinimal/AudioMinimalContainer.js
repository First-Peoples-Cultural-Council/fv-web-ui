import React from 'react'
import PropTypes from 'prop-types'
import AudioMinimalPresentation from './AudioMinimalPresentation'
import AudioMinimalData from './AudioMinimalData'
/**
 * @summary AudioMinimalContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function AudioMinimalContainer({ src, icons }) {
  const { isPlaying, isLoading, isErrored, hasErrored, onClick } = AudioMinimalData({ src })
  return (
    <AudioMinimalPresentation
      hasErrored={hasErrored}
      isErrored={isErrored}
      isLoading={isLoading}
      isPlaying={isPlaying}
      onClick={onClick}
      icons={icons}
    />
  )
}
// PROPTYPES
const { bool, func, string, object } = PropTypes
AudioMinimalContainer.propTypes = {
  src: string,
  color: string,
  onPlayCallback: func,
  shouldStopPropagation: bool,
  icons: object,
}

export default AudioMinimalContainer
