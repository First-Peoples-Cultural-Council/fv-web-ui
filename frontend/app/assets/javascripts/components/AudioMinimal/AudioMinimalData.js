import PropTypes from 'prop-types'
import useAudio from 'DataSource/useAudio'
import { useEffect, useState } from 'react'
/**
 * @summary AudioMinimalData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {string} props.src URL to audio file
 * @param {function} props.children props.children({ isPlaying, onPlay, onPause })
 * @see {@link AudioMinimalPresentation} for info on the children callback object
 */
function AudioMinimalData({ children, src }) {
  const [player] = useState(new Audio(src))
  const [isPlaying, setIsPlaying] = useState(false)
  const { lastPlayed, setLastPlayed, clearLastPlayed } = useAudio()

  const onPlay = () => {
    setLastPlayed(src)
    setIsPlaying(true)
    player.currentTime = 0
    player.play()
  }
  const onPause = () => {
    setIsPlaying(false)
    player.pause()
  }
  player.onended = () => {
    if (lastPlayed === src) {
      clearLastPlayed()
      setIsPlaying(false)
    }
  }

  // Stops any in play audio
  useEffect(() => {
    if (lastPlayed !== src && isPlaying) {
      onPause()
    }
  }, [lastPlayed])

  // Stops audio on unload
  useEffect(() => {
    return () => {
      onPause()
      clearLastPlayed()
    }
  }, [])

  return children({
    isPlaying,
    onPlay,
    onPause,
  })
}

// PROPTYPES
const { string, func } = PropTypes
AudioMinimalData.propTypes = {
  src: string.isRequired,
  children: func.isRequired,
}

export default AudioMinimalData
