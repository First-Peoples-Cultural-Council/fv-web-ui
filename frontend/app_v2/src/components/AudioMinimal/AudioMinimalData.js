import { useContext } from 'react'
import PropTypes from 'prop-types'

import AppStateContext from 'common/AppStateContext'

import { AUDIO_ERRORED, AUDIO_LOADING, AUDIO_PLAYING } from 'common/constants'
/**
 * @summary AudioMinimalData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {string} props.src URL to audio file
 * @param {function} props.children props.children({ isPlaying, onPlay, onPause })
 */
function AudioMinimalData({ children, src }) {
  const { audio } = useContext(AppStateContext)
  const { machine, send } = audio
  const { value, context } = machine
  const playerHasDifferentSrc = context.src !== src

  return children({
    hasErrored: context.errored.includes(src),
    isErrored: playerHasDifferentSrc ? false : value === AUDIO_ERRORED,
    isLoading: playerHasDifferentSrc ? false : value === AUDIO_LOADING,
    isPlaying: playerHasDifferentSrc ? false : value === AUDIO_PLAYING,
    onClick: () => {
      send('CLICK', { src })
    },
  })
}

// PROPTYPES
const { string, func } = PropTypes
AudioMinimalData.propTypes = {
  src: string.isRequired,
  children: func.isRequired,
}

export default AudioMinimalData
