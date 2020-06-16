import { AUDIO_START, AUDIO_STOP } from './actionTypes'

export const setPlaying = (src) => {
  return (dispatch) => {
    dispatch({ type: AUDIO_STOP })
    dispatch({ type: AUDIO_START, src })
  }
}

export const stopPlaying = () => {
  return (dispatch) => {
    dispatch({ type: AUDIO_STOP })
  }
}
