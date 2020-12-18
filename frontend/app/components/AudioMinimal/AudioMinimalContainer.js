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
 * @param {string} props.src URL for audio file
 *
 * @returns {node} jsx markup
 */
function AudioMinimalContainer(props) {
  return (
    <AudioMinimalData src={props.src} onPlayCallback={props.onPlayCallback}>
      {({ isPlaying, onPlay, onPause }) => {
        return (
          <AudioMinimalPresentation
            src={props.src}
            isPlaying={isPlaying}
            onPlay={onPlay}
            onPause={onPause}
            color={props.color}
            shouldStopPropagation={props.shouldStopPropagation}
          />
        )
      }}
    </AudioMinimalData>
  )
}
// PROPTYPES
const { bool, func, string } = PropTypes
AudioMinimalContainer.propTypes = {
  src: string,
  color: string,
  onPlayCallback: func,
  shouldStopPropagation: bool,
}

export default AudioMinimalContainer
