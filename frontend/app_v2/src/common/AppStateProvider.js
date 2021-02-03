import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { Machine, assign } from 'xstate'
import { useMachine } from '@xstate/react'
import AppStateContext from 'common/AppStateContext'
import {
  AUDIO_ERRORED,
  AUDIO_UNLOADED,
  AUDIO_LOADING,
  AUDIO_LOADED,
  AUDIO_STOPPED,
  AUDIO_PLAYING,
} from 'common/constants'

const handleAudioError = assign(({ src, errored }) => {
  return {
    player: new Audio(),
    src: undefined,
    errored: [...errored, src],
  }
})
const loadAudio = assign(({ player }, { src }) => {
  if (player) {
    player.pause()
  }
  return {
    player: new Audio(src),
    src,
  }
})
const playAudio = ({ player }) => {
  player.play()
}
const pauseAudio = ({ player }) => {
  player.pause()
}
const isSameSrc = ({ src: oldSrc }, { src: newSrc }) => {
  return oldSrc === newSrc
}
const audioMachine = Machine({
  initial: AUDIO_UNLOADED,
  context: {
    player: new Audio(),
    src: undefined,
    errored: [],
  },
  states: {
    [AUDIO_ERRORED]: {
      entry: handleAudioError,
      on: {
        CLICK: {
          target: AUDIO_LOADING,
        },
      },
    },
    [AUDIO_UNLOADED]: {
      on: {
        CLICK: {
          target: AUDIO_LOADING,
        },
        [AUDIO_ERRORED]: { target: AUDIO_ERRORED },
      },
    },
    [AUDIO_LOADING]: {
      entry: loadAudio,
      on: {
        [AUDIO_LOADED]: {
          target: AUDIO_PLAYING,
          actions: playAudio,
        },
        [AUDIO_ERRORED]: { target: AUDIO_ERRORED },
      },
    },
    [AUDIO_STOPPED]: {
      on: {
        CLICK: [
          {
            target: AUDIO_PLAYING,
            cond: isSameSrc,
            actions: playAudio,
          },
          {
            target: AUDIO_LOADING,
          },
        ],
        [AUDIO_ERRORED]: { target: AUDIO_ERRORED },
      },
    },
    [AUDIO_PLAYING]: {
      on: {
        [AUDIO_STOPPED]: [
          {
            target: AUDIO_STOPPED,
            cond: isSameSrc,
            actions: pauseAudio,
          },
          {
            target: AUDIO_LOADING,
          },
        ],
        CLICK: [
          {
            target: AUDIO_STOPPED,
            cond: isSameSrc,
            actions: pauseAudio,
          },
          {
            target: AUDIO_LOADING,
          },
        ],
        ESCAPE: [
          {
            target: AUDIO_STOPPED,
            cond: isSameSrc,
            actions: pauseAudio,
          },
          {
            target: AUDIO_LOADING,
          },
        ],
        [AUDIO_ERRORED]: { target: AUDIO_ERRORED },
      },
    },
  },
})
function AppStateProvider({ children }) {
  const [machine, send] = useMachine(audioMachine)
  const { player, src } = machine.context
  useEffect(() => {
    player.addEventListener('canplaythrough', () => {
      send(AUDIO_LOADED)
    })
    player.addEventListener('ended', () => {
      send(AUDIO_STOPPED, { src })
    })
    player.addEventListener('error', () => {
      // TODO: Developed this against a 404ing audio file
      // TODO: but couldn't get into the AUDIO_ERRORED state
      send(AUDIO_ERRORED)
    })
  }, [player])

  return <AppStateContext.Provider value={{ audio: { machine, send } }}>{children}</AppStateContext.Provider>
}
// PROPTYPES
const { node } = PropTypes
AppStateProvider.propTypes = {
  children: node,
}

export default AppStateProvider
