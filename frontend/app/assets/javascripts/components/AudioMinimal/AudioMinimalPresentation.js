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
function AudioMinimalPresentation({ isPlaying, onPause, onPlay, shouldStopPropagation }) {
  return isPlaying ? (
    <AVStop
      color="secondary"
      onClick={(event) => {
        if (shouldStopPropagation) {
          event.stopPropagation()
        }
        onPause()
      }}
    />
  ) : (
    <AVPlayArrow
      color="secondary"
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
const { func, bool } = PropTypes
AudioMinimalPresentation.propTypes = {
  isPlaying: bool,
  onPause: func,
  onPlay: func,
  shouldStopPropagation: bool,
}
AudioMinimalPresentation.defaultProps = {
  shouldStopPropagation: true,
  isPlaying: false,
  onPause: () => {},
  onPlay: () => {},
}

export default AudioMinimalPresentation
