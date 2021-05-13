import React from 'react'
import PropTypes from 'prop-types'
import AudioMinimalPresentation from './AudioMinimalPresentation'
import AudioMinimalData from './AudioMinimalData'
/**
 * @summary AudioMinimalContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function AudioMinimalContainer({ src, icons, iconStyling, label, buttonStyling }) {
  const { isPlaying, isLoading, isErrored, onClick, onKeyPress } = AudioMinimalData({ src })
  return (
    <AudioMinimalPresentation
      isErrored={isErrored}
      isLoading={isLoading}
      isPlaying={isPlaying}
      onClick={onClick}
      onKeyPress={onKeyPress}
      icons={icons}
      iconStyling={iconStyling}
      label={label}
      buttonStyling={buttonStyling}
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
  iconStyling: string,
  label: string,
  buttonStyling: string,
}

export default AudioMinimalContainer
