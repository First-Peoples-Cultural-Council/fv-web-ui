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
    <AudioMinimalData src={props.src}>
      {({ isPlaying, onPlay, onPause }) => {
        return <AudioMinimalPresentation isPlaying={isPlaying} onPlay={onPlay} onPause={onPause} />
      }}
    </AudioMinimalData>
  )
}
// PROPTYPES
const { string } = PropTypes
AudioMinimalContainer.propTypes = {
  src: string,
}

export default AudioMinimalContainer
