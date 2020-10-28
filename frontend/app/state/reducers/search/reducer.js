import { computeQuery } from 'reducers/rest'
import { combineReducers } from 'redux'
import { QUERY_SEARCH_RESULTS_START, QUERY_SEARCH_RESULTS_SUCCESS, QUERY_SEARCH_RESULTS_ERROR } from './actionTypes'

const computeSearchDocumentsQueryFactory = computeQuery('search_documents')

export const searchReducer = combineReducers({
  computeSearchDocuments: computeSearchDocumentsQueryFactory.computeSearchDocuments,
  computeSearchResults(
    state = {
      isFetching: false,
      response: {
        get: () => {
          return ''
        },
      },
      success: false,
    },
    action
  ) {
    switch (action.type) {
      case QUERY_SEARCH_RESULTS_START:
        return { ...state, isFetching: true }

      case QUERY_SEARCH_RESULTS_SUCCESS:
        return { ...state, response: action.documents, isFetching: false, success: true }

      case QUERY_SEARCH_RESULTS_ERROR:
        return { ...state, isFetching: false, isError: true, error: action.error }

      default:
        return { ...state, isFetching: false }
    }
  },
})
