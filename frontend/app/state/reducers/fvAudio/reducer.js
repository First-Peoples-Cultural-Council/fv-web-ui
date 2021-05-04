import { computeFetch } from 'reducers/rest'
import { combineReducers } from 'redux'
import {
  DISMISS_ERROR,
  FV_AUDIOS_SHARED_FETCH_START,
  FV_AUDIOS_SHARED_FETCH_SUCCESS,
  FV_AUDIOS_SHARED_FETCH_ERROR,
} from './actionTypes'

const initialState = {
  isFetching: false,
  response: {
    get: () => {
      return ''
    },
  },
  success: false,
}

const computeSharedAudios = (state = initialState, action) => {
  switch (action.type) {
    case FV_AUDIOS_SHARED_FETCH_START:
      return { ...state, isFetching: true }

    // Send modified document to UI without access REST end-point
    case FV_AUDIOS_SHARED_FETCH_SUCCESS:
      return { ...state, response: action.documents, isFetching: false, success: true }

    // Send modified document to UI without access REST end-point
    case FV_AUDIOS_SHARED_FETCH_ERROR:
      return {
        ...state,
        isFetching: false,
        isError: true,
        error: action.error,
        errorDismissed: action.type === DISMISS_ERROR ? true : false,
      }

    default:
      return { ...state, isFetching: false }
  }
}

/*,
  const computeAudio = (state = { audios: {} }, action) => {
    switch (action.type) {
      case FV_AUDIO_FETCH_START:
      case FV_AUDIO_UPDATE_START:

        action.audios[action.pathOrId].isFetching = true;
        action.audios[action.pathOrId].success = false;

        return Object.assign({}, state, { audios: Object.assign(state.audios, action.audios) });
      break;

      // Send modified document to UI without access REST end-point
      case FV_AUDIO_FETCH_SUCCESS:
      case FV_AUDIO_UPDATE_SUCCESS:

        action.audios[action.pathOrId].isFetching = false;
        action.audios[action.pathOrId].success = true;

        return Object.assign({}, state, { audios: Object.assign(state.audios, action.audios) });
      break;

      // Send modified document to UI without access REST end-point
      case FV_AUDIO_FETCH_ERROR:
      case FV_AUDIO_UPDATE_ERROR:

        action.audios[action.pathOrId].isFetching = false;
        action.audios[action.pathOrId].success = false;
        action.audios[action.pathOrId].isError = true;
        action.audios[action.pathOrId].error = action.error;

        return Object.assign({}, state, { audios: Object.assign(state.audios, action.audios) });
      break;

      default:
        return Object.assign({}, state);
      break;
    }
  }

  const computeCreateAudio = (state = { isFetching: false, response: {get: function() { return ''; }}, success: false }, action) => {
    switch (action.type) {
      case FV_AUDIO_CREATE_START:
        return Object.assign({}, state, { isFetching: true, success: false });
      break;

      // Send modified document to UI without access REST end-point
      case FV_AUDIO_CREATE_SUCCESS:
        return Object.assign({}, state, { response: action.document, isFetching: false, success: true });
      break;

      // Send modified document to UI without access REST end-point
      case FV_AUDIO_CREATE_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error, errorDismissed: (action.type === DISMISS_ERROR) ? true: false });
      break;

      default:
        return Object.assign({}, state, { isFetching: false });
      break;
    }
  }
  */

const _computeAudioFactory = computeFetch('audio')
const computeAudio = _computeAudioFactory.computeAudio

export const fvAudioReducer = combineReducers({
  computeSharedAudios,
  computeAudio,
})
