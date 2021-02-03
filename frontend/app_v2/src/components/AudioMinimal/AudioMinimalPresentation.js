import React from 'react'
import PropTypes from 'prop-types'
import useIcon from 'common/useIcon'
/**
 * @summary AudioMinimalPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {boolean} [props.isPlaying]
 * @param {function} [props.onClick]
 * @param {function} [props.onKeyPress]
 *
 * @returns {node} jsx markup
 */
function AudioMinimalPresentation({ onKeyPress, onClick, isPlaying, isLoading, isErrored, hasErrored }) {
  const PlayCircle = useIcon(
    'PlayCircle',
    `
    fill-current
    w-7
    h-7
    lg:w-8
    lg:h-8
    xl:w-12
    xl:h-12
  `
  )
  const PauseCircle = useIcon(
    'PauseCircle',
    `
    fill-current
    w-7
    h-7
    lg:w-8
    lg:h-8
    xl:w-12
    xl:h-12
  `
  )
  const TimesCircle = useIcon(
    'TimesCircle',
    `
    fill-current
    w-7
    h-7
    lg:w-8
    lg:h-8
    xl:w-12
    xl:h-12
  `
  )
  if (isErrored || hasErrored) {
    return (
      <button type="button" disabled>
        {TimesCircle}
      </button>
    )
  }
  if (isLoading) {
    return (
      <button type="button" disabled>
        {PlayCircle}
      </button>
    )
  }
  if (isPlaying) {
    return (
      <button type="button" onKeyPress={onKeyPress} onClick={onClick}>
        {PauseCircle}
      </button>
    )
  }
  return (
    <button type="button" onClick={onClick}>
      {PlayCircle}
    </button>
  )
}
// PROPTYPES
const { func, bool } = PropTypes
AudioMinimalPresentation.propTypes = {
  isPlaying: bool,
  isLoading: bool,
  isErrored: bool,
  hasErrored: bool,
  onClick: func,
  onKeyPress: func,
}
AudioMinimalPresentation.defaultProps = {
  isPlaying: false,
  isLoading: false,
  isErrored: false,
  hasErrored: false,
  onClick: () => {},
  onKeyPress: () => {},
}

export default AudioMinimalPresentation
