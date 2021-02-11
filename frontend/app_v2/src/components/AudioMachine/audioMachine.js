import { Machine, assign } from 'xstate'
import {
  AUDIO_ERRORED,
  AUDIO_UNLOADED,
  AUDIO_LOADING,
  AUDIO_LOADED,
  AUDIO_STOPPED,
  AUDIO_PLAYING,
  PAGE_NAVIGATION,
} from 'common/constants'

const handleAudioError = assign(({ src, errored }) => {
  return {
    player: new Audio(),
    src: undefined,
    errored: errored.includes(src) ? errored : [...errored, src],
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
const stopAudio = ({ player }) => {
  player.pause()
  player.currentTime = 0
}
const rwdAudio = ({ player, scrubMs }) => {
  const curMs = Math.floor(player.currentTime * 1000)
  const newTimeSec = (curMs - scrubMs) / 1000
  player.currentTime = newTimeSec < 0 ? 0 : newTimeSec
}
const ffwdAudio = ({ player, scrubMs }) => {
  const curMs = Math.floor(player.currentTime * 1000)
  const durationMs = Math.floor(player.duration * 1000)
  const newTimeMs = curMs + scrubMs
  player.currentTime = newTimeMs > durationMs ? durationMs : newTimeMs / 1000
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
    scrubMs: 500,
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
        ARROWRIGHT: {
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
        ARROWRIGHT: [
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
        [PAGE_NAVIGATION]: {
          target: AUDIO_STOPPED,
          actions: stopAudio,
        },
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
        ARROWLEFT: [
          {
            actions: rwdAudio,
          },
        ],
        ARROWRIGHT: [
          {
            actions: ffwdAudio,
          },
        ],
        [AUDIO_ERRORED]: { target: AUDIO_ERRORED },
      },
    },
  },
})

export default audioMachine
