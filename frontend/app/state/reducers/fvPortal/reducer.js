import { computeFetch } from 'reducers/rest'
import { combineReducers } from 'redux'

import {
  DISMISS_ERROR,
  FV_FETCH_PORTALS_START,
  FV_FETCH_PORTALS_FETCH_SUCCESS,
  FV_FETCH_PORTALS_FETCH_ERROR,
} from './actionTypes'

// const computePortalQuery = RESTReducers.computeQuery('portals')
const computePortalFactory = computeFetch('portal')

export const fvPortalReducer = combineReducers({
  computePortal: computePortalFactory.computePortal,
  //   computePortals: computePortalQuery.computePortals,
  computePortals(
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
      case FV_FETCH_PORTALS_START:
        return { ...state, isFetching: true }

      // Send modified document to UI without access REST end-point
      case FV_FETCH_PORTALS_FETCH_SUCCESS:
        return { ...state, response: action.documents, isFetching: false, success: true }

      // Send modified document to UI without access REST end-point
      case FV_FETCH_PORTALS_FETCH_ERROR:
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
