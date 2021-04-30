import {
  DISMISS_ERROR,
  FV_DIALECT_FETCH_START,
  FV_DIALECT_FETCH_SUCCESS,
  FV_DIALECT_FETCH_ERROR,
  FV_DIALECT_UPDATE_START,
  FV_DIALECT_UPDATE_SUCCESS,
  FV_DIALECT_UPDATE_ERROR,
} from './actionTypes'
import { combineReducers } from 'redux'

import { computeQuery, computeFetch, computeOperation } from 'reducers/rest'

const initialState = {
  isFetching: false,
  response: {
    get: () => '',
  },
  success: false,
}

const computeDialectsQuery = computeQuery('dialects')
// const computeDialectQuery = computeQuery('dialect2_query')
const computeDialectByShortURL = computeQuery('dialect2_shorturl')
const computeDialectFetch = computeFetch('dialect2')
const computeDialectStatsOperation = computeOperation('dialect_stats')
const computeDialectListOperation = computeOperation('dialect_list')

const computeDialect = (state = initialState, action = {}) => {
  switch (action.type) {
    case FV_DIALECT_FETCH_START: // NOTE: intentional fallthrough
    case FV_DIALECT_UPDATE_START:
      return { ...state, isFetching: true, success: false }

    // Send modified document to UI without access REST end-point
    case FV_DIALECT_FETCH_SUCCESS: // NOTE: intentional fallthrough
    case FV_DIALECT_UPDATE_SUCCESS:
      return { response: action.document, isFetching: false, success: true }

    // Send modified document to UI without access REST end-point
    case FV_DIALECT_FETCH_ERROR: // NOTE: intentional fallthrough
    case FV_DIALECT_UPDATE_ERROR: // NOTE: intentional fallthrough
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
}
const computeDialect2ByShortURL = computeDialectByShortURL.computeDialect2Shorturl

const computeDialects = computeDialectsQuery.computeDialects

const computeDialect2 = computeDialectFetch.computeDialect2

const computeDialectStats = computeDialectStatsOperation.computeDialectStats

const computeDialectList = computeDialectListOperation.computeDialectList

// export const fvDialectReducer = {
//   computeDialect,
//   computeDialect2ByShortURL,
//   computeDialects,
//   computeDialect2,
//   computeDialectStats,
//   computeDialectList,
// }

export const fvDialectReducer = combineReducers({
  computeDialect,
  computeDialect2ByShortURL,
  computeDialects,
  computeDialect2,
  computeDialectStats,
  computeDialectList,
})
