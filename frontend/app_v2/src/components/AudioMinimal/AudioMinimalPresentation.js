import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import useIcon from 'common/useIcon'
/**
 * @summary AudioMinimalPresentation
 * @version 1.0.0
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function AudioMinimalPresentation({ hasErrored, icons, isErrored, isLoading, isPlaying, onClick, onKeyPress }) {
  const buttonRef = useRef()
  useEffect(() => {
    if (isPlaying) {
      buttonRef.current.focus()
    }
  }, [isPlaying])
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
      <button type="button" disabled aria-live="off">
        <div className="sr-only">Error loading audio</div>
        {Icons.Error}
      </button>
    )
  }
  if (isLoading) {
    return (
      <button type="button" disabled aria-live="off">
        <div className="sr-only">Loading audio</div>
        {Icons.Play}
      </button>
    )
  }

  return (
    <button type="button" onClick={onClick} onKeyDown={onKeyPress} ref={buttonRef} aria-live="off">
      {isPlaying === true && (
        <>
          <div className="sr-only">Pause audio</div>
          {Icons.Pause}
        </>
      )}
      {isPlaying === false && (
        <>
          <div className="sr-only">Play audio</div>
          {Icons.Play}
        </>
      )}
    </button>
  )
}
// PROPTYPES
const { func, bool, object } = PropTypes
AudioMinimalPresentation.propTypes = {
  hasErrored: bool,
  icons: object,
  isErrored: bool,
  isLoading: bool,
  isPlaying: bool,
  onClick: func,
  onKeyPress: func,
}
AudioMinimalPresentation.defaultProps = {
  hasErrored: false,
  isErrored: false,
  isLoading: false,
  isPlaying: false,
  onClick: () => {},
  onKeyPress: () => {},
}

export default AudioMinimalPresentation
