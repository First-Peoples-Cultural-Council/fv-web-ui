import { computeFetch, computeDelete, computeQuery } from 'reducers/rest'
import { combineReducers } from 'redux'

import {
  DISMISS_ERROR,
  FV_LABELS_SHARED_FETCH_START,
  FV_LABELS_SHARED_FETCH_SUCCESS,
  FV_LABELS_SHARED_FETCH_ERROR,
  FV_LABEL_FETCH_ALL_START,
  FV_LABEL_FETCH_ALL_SUCCESS,
  FV_LABEL_FETCH_ALL_ERROR,
  FV_LABELS_USER_MODIFIED_QUERY_START,
  FV_LABELS_USER_MODIFIED_QUERY_SUCCESS,
  FV_LABELS_USER_MODIFIED_QUERY_ERROR,
  FV_LABELS_USER_CREATED_QUERY_START,
  FV_LABELS_USER_CREATED_QUERY_SUCCESS,
  FV_LABELS_USER_CREATED_QUERY_ERROR,
} from './actionTypes'

const initialState = {
  isFetching: false,
  response: {
    get: () => '',
  },
  success: false,
}
const computeLabelFetchFactory = computeFetch('label')
const computeLabelDeleteFactory = computeDelete('delete_label')

const computeLabelsQueryFactory = computeQuery('labels')
const computeRecentlyModifiedLabelsQuery = computeQuery('modified_labels')
const computeRecentlyCreatedLabelsQuery = computeQuery('created_labels')

export const fvLabelReducer = combineReducers({
  computeSharedLabels(state = initialState, action) {
    switch (action.type) {
      case FV_LABELS_SHARED_FETCH_START:
        return { ...state, isFetching: true }

      // Send modified document to UI without access REST end-point
      case FV_LABELS_SHARED_FETCH_SUCCESS:
        return { ...state, response: action.documents, isFetching: false, success: true }

      // Send modified document to UI without access REST end-point
      case FV_LABELS_SHARED_FETCH_ERROR:
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
  computeLabel: computeLabelFetchFactory.computeLabel,
  computeLabels: computeLabelsQueryFactory.computeLabels,
  computeDeleteLabel: computeLabelDeleteFactory.computeDeleteLabel,
  computeLabelsAll(state = initialState, action) {
    switch (action.type) {
      case FV_LABEL_FETCH_ALL_START:
        return { ...state, isFetching: true, success: false }

      case FV_LABEL_FETCH_ALL_SUCCESS:
        return { ...state, response: action.documents, isFetching: false, success: true }

      case FV_LABEL_FETCH_ALL_ERROR: // NOTE: intentional fallthrough
      case DISMISS_ERROR:
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

  computeModifiedLabels: computeRecentlyModifiedLabelsQuery.computeModifiedLabels,
  computeCreatedLabels: computeRecentlyCreatedLabelsQuery.computeCreatedLabels,
  computeUserModifiedLabels(state = initialState, action) {
    switch (action.type) {
      case FV_LABELS_USER_MODIFIED_QUERY_START:
        return { ...state, isFetching: true }

      // Send modified document to UI without access REST end-point
      case FV_LABELS_USER_MODIFIED_QUERY_SUCCESS:
        return { ...state, response: action.document, isFetching: false, success: true }

      // Send modified document to UI without access REST end-point
      case FV_LABELS_USER_MODIFIED_QUERY_ERROR: // NOTE: intentional fallthrough
      case DISMISS_ERROR:
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
  computeUserCreatedLabels(state = initialState, action) {
    switch (action.type) {
      case FV_LABELS_USER_CREATED_QUERY_START:
        return { ...state, isFetching: true }

      // Send modified document to UI without access REST end-point
      case FV_LABELS_USER_CREATED_QUERY_SUCCESS:
        return { ...state, response: action.document, isFetching: false, success: true }

      // Send modified document to UI without access REST end-point
      case FV_LABELS_USER_CREATED_QUERY_ERROR: // NOTE: intentional fallthrough
      case DISMISS_ERROR:
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
})
