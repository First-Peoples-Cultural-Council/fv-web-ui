import { useContext } from 'react'
import PropTypes from 'prop-types'

import AppStateContext from 'common/AppStateContext'

import { AUDIO_LOADING, AUDIO_PLAYING } from 'common/constants'
/**
 * @summary AudioMinimalData
 * @component
 *
 * @param {object} props
 * @param {string} props.src URL to audio file
 */
function AudioMinimalData({ src }) {
  const { audio } = useContext(AppStateContext)
  const { machine, send } = audio
  const { value, context } = machine

  const playerHasDifferentSrc = context.src !== src
  return {
    isErrored: context.errored.includes(src),
    isLoading: playerHasDifferentSrc ? false : value === AUDIO_LOADING,
    isPlaying: playerHasDifferentSrc ? false : value === AUDIO_PLAYING,
    onClick: () => {
      send('CLICK', { src })
    },
    onKeyPress: ({ code }) => {
      send(code.toUpperCase(), { src })
    },
  }
}

// PROPTYPES
const { string } = PropTypes
AudioMinimalData.propTypes = {
  src: string.isRequired,
}

export default AudioMinimalData
