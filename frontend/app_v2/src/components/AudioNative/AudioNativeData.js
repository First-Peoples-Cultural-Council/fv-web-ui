import { useContext } from 'react'
import PropTypes from 'prop-types'

import AppStateContext from 'common/AppStateContext'

import { NATIVE_AUDIO_PLAYING } from 'common/constants'
/**
 * @summary AudioNativeData
 * @component
 *
 * @param {object} props
 * @param {string} props.src URL to audio file
 */
function AudioNativeData({ src }) {
  const { audio } = useContext(AppStateContext)
  const { send } = audio

  const onAudioNativePlay = (audioRef) => send(NATIVE_AUDIO_PLAYING, { src, ref: audioRef })

  return {
    onAudioNativePlay,
  }
}

// PROPTYPES
const { string } = PropTypes
AudioNativeData.propTypes = {
  src: string.isRequired,
}

export default AudioNativeData
