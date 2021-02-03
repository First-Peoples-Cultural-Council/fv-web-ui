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
function AudioMinimalContainer({ src }) {
  return (
    <AudioMinimalData src={src}>
      {({ isPlaying, isLoading, isErrored, hasErrored, onKeyPress, onClick }) => {
        return (
          <AudioMinimalPresentation
            onClick={onClick}
            onKeyPress={onKeyPress}
            isPlaying={isPlaying}
            isLoading={isLoading}
            hasErrored={hasErrored}
            isErrored={isErrored}
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
