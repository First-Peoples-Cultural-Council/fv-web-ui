import { computeFetch } from 'reducers/rest'
import { combineReducers } from 'redux'

import {
  DISMISS_ERROR,
  FV_PICTURES_SHARED_FETCH_START,
  FV_PICTURES_SHARED_FETCH_SUCCESS,
  FV_PICTURES_SHARED_FETCH_ERROR,
  FV_PICTURE_FETCH_STATS_START,
  FV_PICTURE_FETCH_STATS_SUCCESS,
  FV_PICTURE_FETCH_STATS_ERROR,
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

const computePictureFactory = computeFetch('picture')

export const fvPictureReducer = combineReducers({
  computeSharedPictures(state = initialState, action) {
    switch (action.type) {
      case FV_PICTURES_SHARED_FETCH_START:
        return { ...state, isFetching: true }

      // Send modified document to UI without access REST end-point
      case FV_PICTURES_SHARED_FETCH_SUCCESS:
        return { ...state, response: action.documents, isFetching: false, success: true }

      // Send modified document to UI without access REST end-point
      case FV_PICTURES_SHARED_FETCH_ERROR:
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
  /*  computePicture(state = { pictures: {} }, action) {    switch (action.type) {      case FV_PICTURE_FETCH_START:      case FV_PICTURE_UPDATE_START:      case FV_PICTURE_UPDATE_START:

        action.pictures[action.pathOrId].isFetching = true;
        action.pictures[action.pathOrId].success = false;

        return { ...state,  pictures: Object.assign(state.pictures, action.pictures) });
      break;

      // Send modified document to UI without access REST end-point
      case FV_PICTURE_FETCH_SUCCESS:
      case FV_PICTURE_UPDATE_SUCCESS:

        action.pictures[action.pathOrId].isFetching = false;
        action.pictures[action.pathOrId].success = true;

        return { ...state,  pictures: Object.assign(state.pictures, action.pictures) });
      break;

      // Send modified document to UI without access REST end-point
      case FV_PICTURE_FETCH_ERROR:
      case FV_PICTURE_UPDATE_ERROR:

        action.pictures[action.pathOrId].isFetching = false;
        action.pictures[action.pathOrId].success = false;
        action.pictures[action.pathOrId].isError = true;
        action.pictures[action.pathOrId].error = action.error;

        return { ...state,  pictures: Object.assign(state.pictures, action.pictures) });
      break;

      default:
        return Object.assign({}, state);
      break;
    }
  },*/
  computePicture: computePictureFactory.computePicture,
  /*computeCreatePicture(state = { isFetching: false, response: {get: function() { return ''; }}, success: false }, action) {
      switch (action.type) {
        case FV_PICTURE_CREATE_START:
          return { ...state,  isFetching: true, success: false });
        break;

        // Send modified document to UI without access REST end-point
        case FV_PICTURE_CREATE_SUCCESS:
          return { ...state,  response: action.document, isFetching: false, success: true });
        break;

        // Send modified document to UI without access REST end-point
        case FV_PICTURE_CREATE_ERROR:
          return { ...state,  isFetching: false, isError: true, error: action.error, errorDismissed: (action.type === DISMISS_ERROR) ? true: false });
        break;

        default:
          return { ...state,  isFetching: false });
        break;
      }
    },*/
  computePictureStats(state = initialState, action) {
    switch (action.type) {
      case FV_PICTURE_FETCH_STATS_START:
        return { ...state, isFetching: true, success: false }

      case FV_PICTURE_FETCH_STATS_SUCCESS:
        return { ...state, response: action.document, isFetching: false, success: true }

      case FV_PICTURE_FETCH_STATS_ERROR:
        return { ...state, isFetching: false, isError: true, error: action.error }

      default:
        return { ...state, isFetching: false }
    }
  },
})
