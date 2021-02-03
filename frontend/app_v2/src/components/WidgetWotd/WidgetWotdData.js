import { useState } from 'react'
import PropTypes from 'prop-types'

/**
 * @summary WidgetWotdData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function WidgetWotdData({ children }) {
  // Temporary hardcoded data - replace with your own to run locally
  const entry = {
    title: "ali'wadzāgwis",
    definition:
      'the people sitting at a potlatch, that is, the members of the invited clans as opposed to the host clan.',
    audioSrc:
      'http://localhost:3001/nuxeo/nxfile/default/16537646-937b-489a-ae3d-3f41ff8ba794/file:content/TestWav.wav',
    url:
      'http://localhost:3001/explore/FV/Workspaces/Data/Test/Test/TestDialectPublic/learn/words/4ad2f6f8-2105-4144-b75e-19de15134a2a',
  }

  const [player] = useState(new Audio(entry.audioSrc))
  const [isPlaying, setIsPlaying] = useState(false)

  const onAudioClick = () => {
    if (isPlaying) {
      player.pause()
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
      player.play()
    }
  }

  player.onended = () => {
    setIsPlaying(false)
  }

  return children({
    entry,
    onAudioClick,
  })
}
// PROPTYPES
const { func } = PropTypes
WidgetWotdData.propTypes = {
  children: func,
}

export default WidgetWotdData
