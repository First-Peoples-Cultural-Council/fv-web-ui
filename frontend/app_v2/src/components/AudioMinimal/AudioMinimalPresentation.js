import React from 'react'
import PropTypes from 'prop-types'
import useIcon from 'common/useIcon'
/**
 * @summary AudioMinimalPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function AudioMinimalPresentation({ hasErrored, icons, isErrored, isLoading, isPlaying, onClick }) {
  const iconsDefault = {
    Play: useIcon(
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
    ),
    Pause: useIcon(
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
    ),
    Error: useIcon(
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
    ),
  }
  const Icons = Object.assign({}, iconsDefault, icons)

  if (isErrored || hasErrored) {
    return (
      <button type="button" disabled>
        {Icons.Error}
      </button>
    )
  }
  if (isLoading) {
    return (
      <button type="button" disabled>
        {Icons.Play}
      </button>
    )
  }
  if (isPlaying) {
    return (
      <button type="button" onClick={onClick}>
        {Icons.Pause}
      </button>
    )
  }
  return (
    <button type="button" onClick={onClick}>
      {Icons.Play}
    </button>
  )
}
// PROPTYPES
const { func, bool, object } = PropTypes
AudioMinimalPresentation.propTypes = {
  isPlaying: bool,
  isLoading: bool,
  isErrored: bool,
  hasErrored: bool,
  onClick: func,
  icons: object,
}
AudioMinimalPresentation.defaultProps = {
  isPlaying: false,
  isLoading: false,
  isErrored: false,
  hasErrored: false,
  onClick: () => {},
}

export default AudioMinimalPresentation
