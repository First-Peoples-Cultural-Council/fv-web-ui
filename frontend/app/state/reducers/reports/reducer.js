import { combineReducers } from 'redux'

import {
  REPORT_DOCUMENTS_FETCH_START,
  REPORT_DOCUMENTS_FETCH_SUCCESS,
  REPORT_DOCUMENTS_FETCH_ERROR,
  REPORT_WORDS_ALL_FETCH_START,
  REPORT_WORDS_ALL_FETCH_SUCCESS,
  REPORT_WORDS_ALL_FETCH_ERROR,
  REPORT_PHRASES_ALL_FETCH_START,
  REPORT_PHRASES_ALL_FETCH_SUCCESS,
  REPORT_PHRASES_ALL_FETCH_ERROR,
  REPORT_SONGS_ALL_FETCH_START,
  REPORT_SONGS_ALL_FETCH_SUCCESS,
  REPORT_SONGS_ALL_FETCH_ERROR,
  REPORT_STORIES_ALL_FETCH_START,
  REPORT_STORIES_ALL_FETCH_SUCCESS,
  REPORT_STORIES_ALL_FETCH_ERROR,
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

export const reportsReducer = combineReducers({
  computeReportDocuments(state = initialState, action) {
    switch (action.type) {
      case REPORT_DOCUMENTS_FETCH_START:
        return { ...state, isFetching: true }

      case REPORT_DOCUMENTS_FETCH_SUCCESS:
        return { ...state, response: action.documents, isFetching: false, success: true }

      case REPORT_DOCUMENTS_FETCH_ERROR:
        return { ...state, isFetching: false, isError: true, error: action.error }

      default:
        return { ...state, isFetching: false }
    }
  },

  computeReportWordsAll(state = initialState, action) {
    switch (action.type) {
      case REPORT_WORDS_ALL_FETCH_START:
        return { ...state, isFetching: true }

      case REPORT_WORDS_ALL_FETCH_SUCCESS:
        return { ...state, response: action.documents, isFetching: false, success: true }

      case REPORT_WORDS_ALL_FETCH_ERROR:
        return { ...state, isFetching: false, isError: true, error: action.error }

      default:
        return { ...state, isFetching: false }
    }
  },

  computeReportPhrasesAll(state = initialState, action) {
    switch (action.type) {
      case REPORT_PHRASES_ALL_FETCH_START:
        return { ...state, isFetching: true }

      case REPORT_PHRASES_ALL_FETCH_SUCCESS:
        return { ...state, response: action.documents, isFetching: false, success: true }

      case REPORT_PHRASES_ALL_FETCH_ERROR:
        return { ...state, isFetching: false, isError: true, error: action.error }

      default:
        return { ...state, isFetching: false }
    }
  },

  computeReportSongsAll(state = initialState, action) {
    switch (action.type) {
      case REPORT_SONGS_ALL_FETCH_START:
        return { ...state, isFetching: true }

      case REPORT_SONGS_ALL_FETCH_SUCCESS:
        return { ...state, response: action.documents, isFetching: false, success: true }

      case REPORT_SONGS_ALL_FETCH_ERROR:
        return { ...state, isFetching: false, isError: true, error: action.error }

      default:
        return { ...state, isFetching: false }
    }
  },

  computeReportStoriesAll(state = initialState, action) {
    switch (action.type) {
      case REPORT_STORIES_ALL_FETCH_START:
        return { ...state, isFetching: true }

      case REPORT_STORIES_ALL_FETCH_SUCCESS:
        return { ...state, response: action.documents, isFetching: false, success: true }

      case REPORT_STORIES_ALL_FETCH_ERROR:
        return { ...state, isFetching: false, isError: true, error: action.error }

      default:
        return { ...state, isFetching: false }
    }
  },
})
