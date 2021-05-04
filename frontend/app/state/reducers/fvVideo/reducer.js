import { computeFetch } from 'reducers/rest'
import { combineReducers } from 'redux'
import {
  DISMISS_ERROR,
  FV_VIDEOS_SHARED_FETCH_START,
  FV_VIDEOS_SHARED_FETCH_SUCCESS,
  FV_VIDEOS_SHARED_FETCH_ERROR,
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
const computeVideoFactory = computeFetch('video')

export const fvVideoReducer = combineReducers({
  computeSharedVideos(state = initialState, action) {
    switch (action.type) {
      case FV_VIDEOS_SHARED_FETCH_START:
        return { ...state, isFetching: true }

      // Send modified document to UI without access REST end-point
      case FV_VIDEOS_SHARED_FETCH_SUCCESS:
        return { ...state, response: action.documents, isFetching: false, success: true }

      // Send modified document to UI without access REST end-point
      case FV_VIDEOS_SHARED_FETCH_ERROR:
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
  },
  /*
  computeVideo(state = { videos: {} }, action) {    switch (action.type) {      case FV_VIDEO_FETCH_START:      case FV_VIDEO_UPDATE_START:        action.videos[action.pathOrId].isFetching = true;
        action.videos[action.pathOrId].success = false;

        return { ...state,  videos: Object.assign(state.videos, action.videos) }

      // Send modified document to UI without access REST end-point
      case FV_VIDEO_FETCH_SUCCESS: // NOTE: intentional fallthrough
      case FV_VIDEO_UPDATE_SUCCESS:

        action.videos[action.pathOrId].isFetching = false;
        action.videos[action.pathOrId].success = true;

        return { ...state,  videos: Object.assign(state.videos, action.videos) }

      // Send modified document to UI without access REST end-point
      case FV_VIDEO_FETCH_ERROR: // NOTE: intentional fallthrough
      case FV_VIDEO_UPDATE_ERROR:

        action.videos[action.pathOrId].isFetching = false;
        action.videos[action.pathOrId].success = false;
        action.videos[action.pathOrId].isError = true;
        action.videos[action.pathOrId].error = action.error;

        return { ...state,  videos: Object.assign(state.videos, action.videos) }

      default:
        return Object.assign({}, state);
    }
  },
  computeCreateVideo(state = { isFetching: false, response: {get: function() { return ''; }}, success: false }, action) {
    switch (action.type) {
      case FV_VIDEO_CREATE_START:
        return { ...state,  isFetching: true, success: false }

      // Send modified document to UI without access REST end-point
      case FV_VIDEO_CREATE_SUCCESS:
        return { ...state,  response: action.document, isFetching: false, success: true }

      // Send modified document to UI without access REST end-point
      case FV_VIDEO_CREATE_ERROR:
        return { ...state,  isFetching: false, isError: true, error: action.error, errorDismissed: (action.type === DISMISS_ERROR) ? true: false }

      default:
        return { ...state,  isFetching: false }
    }
  },
  */
  computeVideo: computeVideoFactory.computeVideo,
})
