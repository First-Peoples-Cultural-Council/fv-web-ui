import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import useIcon from 'common/useIcon'
/**
 * @summary AudioMinimalPresentation
 * @component
 */
function AudioMinimalPresentation({
  buttonStyling,
  icons,
  iconStyling,
  isErrored,
  isLoading,
  isPlaying,
  label,
  onClick,
  onKeyPress,
}) {
  const buttonRef = useRef()
  useEffect(() => {
    if (isPlaying) {
      buttonRef.current.focus()
    }
  }, [isPlaying])
  const iconsDefault = {
    Play: useIcon('PlayCircle', iconStyling),
    Pause: useIcon('PauseCircle', iconStyling),
    Error: useIcon('TimesCircle', iconStyling),
  }
  const Icons = Object.assign({}, iconsDefault, icons)

  if (isErrored) {
    return (
      <button type="button" disabled aria-live="off" className={buttonStyling}>
        <div className="sr-only">Error loading audio</div>
        {Icons.Error}
        {label}
      </button>
    )
  }
  if (isLoading) {
    return (
      <button type="button" disabled aria-live="off" className={buttonStyling}>
        <div className="sr-only">Loading audio</div>
        {Icons.Play}
        {label}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={onKeyPress}
      ref={buttonRef}
      aria-live="off"
      className={buttonStyling}
    >
      {isPlaying === true && (
        <>
          <div className="sr-only">Pause audio</div>
          {Icons.Pause}
          {label}
        </>
      )}
      {isPlaying === false && (
        <>
          <div className="sr-only">Play audio</div>
          {Icons.Play}
          {label}
        </>
      )}
    </button>
  )
}
// PROPTYPES
const { func, bool, object, string } = PropTypes
AudioMinimalPresentation.propTypes = {
  /** Use to override the default icons. Eg: icons={{Play: jsx, Pause: jsx, Error: jsx}}  */
  icons: object,
  /** Use to style icons */
  iconStyling: string,
  /** Use to style encasing button */
  buttonStyling: string,
  /** Set to true if Audio player encounters an error. Displays the erorred icon */
  isErrored: bool,
  /** Set to true when audio is loading. Changes screen reader text  */
  isLoading: bool,
  /** Set to true while audio is playing. Changes screen reader text & icon  */
  isPlaying: bool,
  /** Optional abel for button */
  label: string,
  /** Event handler for button click. The handler provided by AudioMinimalData issues a send call to the state machine */
  onClick: func,
  /** Event handler for keyboard support. The handler provided by AudioMinimalData issues a send call to the state machine */
  onKeyPress: func,
}
AudioMinimalPresentation.defaultProps = {
  iconStyling: 'fill-current w-7 h-7 lg:w-8 lg:h-8 xl:w-12 xl:h-12',
  buttonStyling: '',
  isErrored: false,
  isLoading: false,
  isPlaying: false,
  onClick: () => {},
  onKeyPress: () => {},
}

export default AudioMinimalPresentation
