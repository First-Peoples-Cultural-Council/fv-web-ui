import { Machine, assign } from 'xstate'
import {
  AUDIO_ERRORED,
  AUDIO_UNLOADED,
  AUDIO_LOADING,
  AUDIO_LOADED,
  AUDIO_STOPPED,
  AUDIO_PLAYING,
  PAGE_NAVIGATION,
  NATIVE_AUDIO_PLAYING,
} from 'common/constants'

// All players
// ----------------------------
const pauseAllAudio = ({ player, nativePlayer, incomingNativePlayer }) => {
  if (
    nativePlayer?.current &&
    nativePlayer?.current.paused === false &&
    nativePlayer?.current !== incomingNativePlayer?.current
  ) {
    nativePlayer.current.pause()
  }
  if (player) {
    player.pause()
  }
}
// JS Audio Player
// ----------------------------
const playAudio = ({ player, nativePlayer }) => {
  pauseAllAudio({ player, nativePlayer })
  player.play()
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
// Entry
// ----------------------------
const entryAudioLoading = assign(({ player, nativePlayer }, { src }) => {
  pauseAllAudio({ player, nativePlayer })
  return {
    player: new Audio(src),
    src,
  }
})
const entryNativeAudioPlaying = assign(({ player, nativePlayer }, { src, ref }) => {
  pauseAllAudio({ player, nativePlayer, incomingNativePlayer: ref })
  return {
    player: new Audio(),
    src,
    nativePlayer: ref,
  }
})
const entryAudioErrored = assign(({ src, errored }) => {
  return {
    player: new Audio(),
    src: undefined,
    // Note: Native players are disabled with a malformed url so
    // they can't be played and don't need to be added to the errored array
    errored: errored.includes(src) ? errored : [...errored, src],
  }
})
// Helper
// ----------------------------
const isSameSrc = ({ src: oldSrc }, { src: newSrc }) => {
  return oldSrc === newSrc
}

export const initialMachineState = {
  initial: AUDIO_UNLOADED,
  context: {
    player: new Audio(),
    src: undefined,
    errored: [],
    scrubMs: 500,
    nativePlayer: undefined, // ref
  },
  states: {
    [NATIVE_AUDIO_PLAYING]: {
      entry: entryNativeAudioPlaying,
      on: {
        CLICK: {
          target: AUDIO_LOADING,
        },
        ARROWRIGHT: {
          target: AUDIO_LOADING,
        },
        [AUDIO_ERRORED]: { target: AUDIO_ERRORED },
        [NATIVE_AUDIO_PLAYING]: {
          target: NATIVE_AUDIO_PLAYING,
        },
      },
    },
    [AUDIO_ERRORED]: {
      entry: entryAudioErrored,
      on: {
        CLICK: {
          target: AUDIO_LOADING,
        },
      },
      [NATIVE_AUDIO_PLAYING]: {
        target: NATIVE_AUDIO_PLAYING,
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
        NATIVE_AUDIO_PLAYING: {
          target: NATIVE_AUDIO_PLAYING,
        },
      },
    },
    [AUDIO_LOADING]: {
      entry: entryAudioLoading,
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
        [NATIVE_AUDIO_PLAYING]: {
          target: NATIVE_AUDIO_PLAYING,
        },
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
            actions: pauseAllAudio,
          },
          {
            target: AUDIO_LOADING,
          },
        ],
        CLICK: [
          {
            target: AUDIO_STOPPED,
            cond: isSameSrc,
            actions: pauseAllAudio,
          },
          {
            target: AUDIO_LOADING,
          },
        ],
        ESCAPE: [
          {
            target: AUDIO_STOPPED,
            cond: isSameSrc,
            actions: pauseAllAudio,
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
        [NATIVE_AUDIO_PLAYING]: {
          target: NATIVE_AUDIO_PLAYING,
        },
      },
    },
  },
}
const audioMachine = Machine(initialMachineState)

export default audioMachine
