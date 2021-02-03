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
      {({ isPlaying, isLoading, isErrored, hasErrored, onClick }) => {
        return (
          <AudioMinimalPresentation
            hasErrored={hasErrored}
            isErrored={isErrored}
            isLoading={isLoading}
            isPlaying={isPlaying}
            onClick={onClick}
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
