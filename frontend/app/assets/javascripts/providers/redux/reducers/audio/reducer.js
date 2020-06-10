import { combineReducers } from 'redux'
import { AUDIO_START, AUDIO_STOP } from './actionTypes'

export const audioReducer = combineReducers({
  lastPlayed(state = '', action) {
    switch (action.type) {
      case AUDIO_STOP:
        return ''

      case AUDIO_START:
        return action.src

      default:
        return state
    }
  },
})
