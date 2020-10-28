import {
  DISMISS_ERROR,
  FV_CONTRIBUTORS_FETCH_START,
  FV_CONTRIBUTORS_FETCH_SUCCESS,
  FV_CONTRIBUTORS_FETCH_ERROR,
  FV_CONTRIBUTORS_SHARED_FETCH_START,
  FV_CONTRIBUTORS_SHARED_FETCH_SUCCESS,
  FV_CONTRIBUTORS_SHARED_FETCH_ERROR,
  FV_CONTRIBUTOR_FETCH_ALL_START,
  FV_CONTRIBUTOR_FETCH_ALL_SUCCESS,
  FV_CONTRIBUTOR_FETCH_ALL_ERROR,
  FV_CONTRIBUTOR_CREATE_START,
  FV_CONTRIBUTOR_CREATE_SUCCESS,
  FV_CONTRIBUTOR_CREATE_ERROR,
} from './actionTypes'
import { combineReducers } from 'redux'

import { computeFetch, computeQuery } from 'reducers/rest'
const computeContributorFactory = computeFetch('contributor')
const computeContributorsFactory = computeQuery('contributors')

const initialState = {
  isFetching: false,
  response: {
    get: () => {
      return ''
    },
  },
  success: false,
}

const computeSharedContributors = (state = initialState, action) => {
  switch (action.type) {
    case FV_CONTRIBUTORS_SHARED_FETCH_START:
      return { ...state, isFetching: true }

    // Send modified document to UI without access REST end-point
    case FV_CONTRIBUTORS_SHARED_FETCH_SUCCESS:
      return { ...state, response: action.documents, isFetching: false, success: true }

    // Send modified document to UI without access REST end-point
    case FV_CONTRIBUTORS_SHARED_FETCH_ERROR:
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

const computeContributorsInPath = (state = initialState, action) => {
  switch (action.type) {
    case FV_CONTRIBUTORS_FETCH_START:
      return { ...state, isFetching: true }

    // Send modified document to UI without access REST end-point
    case FV_CONTRIBUTORS_FETCH_SUCCESS:
      return { ...state, response: action.documents, isFetching: false, success: true }

    // Send modified document to UI without access REST end-point
    case FV_CONTRIBUTORS_FETCH_ERROR: // Note: intentional fallthrough
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

// TODO: CHECK ON THESE
const computeContributor = computeContributorFactory.computeContributor
const computeContributors = computeContributorsFactory.computeContributors

/*
const computeContributor = (state = { contributors: {} }, action) => {
  switch (action.type) {
    case FV_CONTRIBUTOR_FETCH_START:
    case FV_CONTRIBUTOR_UPDATE_START:

      action.contributors[action.pathOrId].isFetching = true;
      action.contributors[action.pathOrId].success = false;

      return Object.assign({}, state, { contributors: Object.assign(state.contributors, action.contributors) });
    break;

    // Send modified document to UI without access REST end-point
    case FV_CONTRIBUTOR_FETCH_SUCCESS:
    case FV_CONTRIBUTOR_UPDATE_SUCCESS:

      action.contributors[action.pathOrId].isFetching = false;
      action.contributors[action.pathOrId].success = true;

      return Object.assign({}, state, { contributors: Object.assign(state.contributors, action.contributors) });
    break;

    // Send modified document to UI without access REST end-point
    case FV_CONTRIBUTOR_FETCH_ERROR:
    case FV_CONTRIBUTOR_UPDATE_ERROR:

      action.contributors[action.pathOrId].isFetching = false;
      action.contributors[action.pathOrId].success = false;
      action.contributors[action.pathOrId].isError = true;
      action.contributors[action.pathOrId].error = action.error;

      return Object.assign({}, state, { contributors: Object.assign(state.contributors, action.contributors) });
    break;

    default:
      return state
    break;
  }
}
*/
const computeCreateContributor = (
  state = {
    ...initialState,
    pathOrId: null,
  },
  action
) => {
  switch (action.type) {
    case FV_CONTRIBUTOR_CREATE_START:
      return { ...state, isFetching: true, success: false, pathOrId: action.pathOrId }

    // Send modified document to UI without access REST end-point
    case FV_CONTRIBUTOR_CREATE_SUCCESS:
      return {
        ...state,
        response: action.document,
        isFetching: false,
        success: true,
        pathOrId: action.pathOrId,
        isError: false,
        error: null,
      }

    // Send modified document to UI without access REST end-point
    case FV_CONTRIBUTOR_CREATE_ERROR:
      return { ...state, isFetching: false, isError: true, error: action.error, pathOrId: action.pathOrId }

    default:
      return { ...state, isFetching: false }
  }
}

const computeContributorsAll = (state = initialState, action) => {
  switch (action.type) {
    case FV_CONTRIBUTOR_FETCH_ALL_START:
      return { ...state, isFetching: true, success: false }

    case FV_CONTRIBUTOR_FETCH_ALL_SUCCESS:
      return { ...state, response: action.documents, isFetching: false, success: true }

    case FV_CONTRIBUTOR_FETCH_ALL_ERROR:
    // Note: intentional fallthrough
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

// export const fvContributorReducer = {
//   computeSharedContributors,
//   computeContributorsInPath,
//   computeContributor,
//   computeContributors,
//   computeCreateContributor,
//   computeContributorsAll,
// }

export const fvContributorReducer = combineReducers({
  computeSharedContributors,
  computeContributorsInPath,
  computeContributor,
  computeContributors,
  computeCreateContributor,
  computeContributorsAll,
})
