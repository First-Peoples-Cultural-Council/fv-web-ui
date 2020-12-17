import React from 'react'
import PropTypes from 'prop-types'
import AVPlayArrow from '@material-ui/icons/PlayArrow'
import AVStop from '@material-ui/icons/Stop'

/**
 * @summary AudioMinimalPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {boolean} [props.isPlaying] Flag used to toggle the play/pause buttons. Default: false
 * @param {function} [props.onPause] Callback when paused. Default: () => {}
 * @param {function} [props.onPlay] Callback when played. Default: () => {}
 * @param {boolean} [props.shouldStopPropagation] Flag for event.stopPropagation() when clicking on buttons. Default: true
 *
 * @returns {node} jsx markup
 */
function AudioMinimalPresentation({ color, isPlaying, onPause, onPlay, shouldStopPropagation, src }) {
  return isPlaying ? (
    <AVStop
      color={color}
      onClick={(event) => {
        if (shouldStopPropagation) {
          event.stopPropagation()
        }
        onPause()
      }}
    />
  ) : (
    <AVPlayArrow
      // id used by other components to getElement and trigger onPlay to expand click area e.g. Alphabet buttons
      id={src}
      color={color}
      onClick={(event) => {
        if (shouldStopPropagation) {
          event.stopPropagation()
        }
        onPlay()
      }}
    />
  )
}
// PROPTYPES
const { func, bool, string } = PropTypes
AudioMinimalPresentation.propTypes = {
  color: string,
  isPlaying: bool,
  onPause: func,
  onPlay: func,
  shouldStopPropagation: bool,
  src: string,
}
AudioMinimalPresentation.defaultProps = {
  color: 'secondary',
  shouldStopPropagation: true,
  isPlaying: false,
  onPause: () => {},
  onPlay: () => {},
}

export default AudioMinimalPresentation
