// NOTE: Functions provided by this reducer are only being used by other reducers.
// No jsx components are mapping them.
// That's why we aren't exporting the `combineReducers`.
import { List, Map } from 'immutable'

const TITLE_CASE_KEY = (key) => {
  return key[0].toUpperCase() + key.substring(1)
}

const UPPER_CASE_KEY = (key) => {
  return 'FV_' + key.toUpperCase()
}

const CAMEL_CASE_KEY = (key) => {
  if (key.indexOf('_') === -1) {
    return TITLE_CASE_KEY(key)
  }

  let modifiedKey = ''
  const keyArray = key.split('_')

  for (let i = 0; i < keyArray.length; ++i) {
    modifiedKey += TITLE_CASE_KEY(keyArray[i])
  }

  return modifiedKey
}

const getListIndexForPushOrReplace = (s, i) => {
  return i === -1 ? s.size : i
}

const getPreviousResponse = (s, i) => {
  if (i !== -1) {
    if (s.get(i).has('response')) {
      return s.get(i).get('response')
    } else if (s.get(i).has('response_prev')) {
      return s.get(i).get('response_prev')
    }
  }

  return null
}
const defaultKey = 'contributor'

export const computeFetch = (key = defaultKey) => {
  const uck = UPPER_CASE_KEY(key)
  return {
    [`compute${CAMEL_CASE_KEY(key)}`]: (state = new List([]), action) => {
      // Find entry within state based on id
      const indexOfEntry = state.findIndex((item) => {
        return item.get('id') === action.pathOrId
      })

      switch (action.type) {
        case `${uck}_FETCH_START`: // NOTE: intentional fallthrough
        case `${uck}_UPDATE_START`: // NOTE: intentional fallthrough
        case `${uck}_CREATE_START`: // NOTE: intentional fallthrough
        case `${uck}_PUBLISH_EXECUTE_START`: // NOTE: intentional fallthrough
        case `${uck}_PUBLISH_WORKFLOW_EXECUTE_START`: // NOTE: intentional fallthrough
        case `${uck}_UNPUBLISH_EXECUTE_START`: // NOTE: intentional fallthrough
        case `${uck}_UNPUBLISH_WORKFLOW_EXECUTE_START`: // NOTE: intentional fallthrough
        case `${uck}_ENABLE_EXECUTE_START`: // NOTE: intentional fallthrough
        case `${uck}_ENABLE_WORKFLOW_EXECUTE_START`: // NOTE: intentional fallthrough
        case `${uck}_DISABLE_EXECUTE_START`: // NOTE: intentional fallthrough
        case `${uck}_DISABLE_WORKFLOW_EXECUTE_START`:
          // Push or replace
          return state.set(
            getListIndexForPushOrReplace(state, indexOfEntry),
            Map({
              action: action.type,
              id: action.pathOrId,
              message: action.message,
              response_prev: getPreviousResponse(state, indexOfEntry),
              isFetching: true,
              success: false,
            })
          )

        case `${uck}_FETCH_SUCCESS`: // NOTE: intentional fallthrough
        case `${uck}_UPDATE_SUCCESS`: // NOTE: intentional fallthrough
        case `${uck}_CREATE_SUCCESS`: // NOTE: intentional fallthrough
        case `${uck}_PUBLISH_EXECUTE_SUCCESS`: // NOTE: intentional fallthrough
        case `${uck}_REPUBLISH_EXECUTE_SUCCESS`: // NOTE: intentional fallthrough
        case `${uck}_PUBLISH_WORKFLOW_EXECUTE_SUCCESS`: // NOTE: intentional fallthrough
        case `${uck}_UNPUBLISH_EXECUTE_SUCCESS`: // NOTE: intentional fallthrough
        case `${uck}_UNPUBLISH_WORKFLOW_EXECUTE_SUCCESS`: // NOTE: intentional fallthrough
        case `${uck}_ENABLE_EXECUTE_SUCCESS`: // NOTE: intentional fallthrough
        case `${uck}_ENABLE_WORKFLOW_EXECUTE_SUCCESS`: // NOTE: intentional fallthrough
        case `${uck}_DISABLE_EXECUTE_SUCCESS`: // NOTE: intentional fallthrough
        case `${uck}_DISABLE_WORKFLOW_EXECUTE_SUCCESS`:
          // Replace entry within state
          return state.set(
            indexOfEntry,
            Map({
              action: action.type,
              id: action.pathOrId,
              isFetching: false,
              success: true,
              wasUpdated: action.type.indexOf('_UPDATE_') !== -1,
              wasCreated: action.type.indexOf('_CREATE_') !== -1,
              response: action.response,
              response_prev: getPreviousResponse(state, indexOfEntry),
              message: action.message,
            })
          )

        case `${uck}_FETCH_ERROR`: // NOTE: intentional fallthrough
        case `${uck}_UPDATE_ERROR`: // NOTE: intentional fallthrough
        case `${uck}_CREATE_ERROR`: // NOTE: intentional fallthrough
        case `${uck}_PUBLISH_EXECUTE_ERROR`: // NOTE: intentional fallthrough
        case `${uck}_PUBLISH_WORKFLOW_EXECUTE_ERROR`: // NOTE: intentional fallthrough
        case `${uck}_UNPUBLISH_EXECUTE_ERROR`: // NOTE: intentional fallthrough
        case `${uck}_UNPUBLISH_WORKFLOW_EXECUTE_ERROR`: // NOTE: intentional fallthrough
        case `${uck}_ENABLE_EXECUTE_ERROR`: // NOTE: intentional fallthrough
        case `${uck}_ENABLE_WORKFLOW_EXECUTE_ERROR`: // NOTE: intentional fallthrough
        case `${uck}_DISABLE_EXECUTE_ERROR`: // NOTE: intentional fallthrough
        case `${uck}_DISABLE_WORKFLOW_EXECUTE_ERROR`: // NOTE: intentional fallthrough
          // Add error message
          return state.set(
            indexOfEntry,
            Map({
              action: action.type,
              id: action.pathOrId,
              isFetching: false,
              isError: true,
              success: false,
              response: state.get(indexOfEntry).get('response') || getPreviousResponse(state, indexOfEntry),
              response_prev: getPreviousResponse(state, indexOfEntry),
              message: action.message,
            })
          )

        default: // Note: do nothing
      }

      return state
    },
  }
}
export const computeQuery = (key = defaultKey) => {
  const uck = UPPER_CASE_KEY(key)
  return {
    [`compute${CAMEL_CASE_KEY(key)}`]: (state = new List([]), action) => {
      // Find entry within state based on id
      const indexOfEntry = state.findIndex((item) => {
        return item.get('id') === action.pathOrId
      })

      switch (action.type) {
        case `${uck}_QUERY_START`:
          // push or replace
          return state.set(
            getListIndexForPushOrReplace(state, indexOfEntry),
            Map({
              action: action.type,
              id: action.pathOrId,
              message: action.message,
              response_prev: getPreviousResponse(state, indexOfEntry),
              isFetching: true,
              success: false,
            })
          )

        case `${uck}_QUERY_SUCCESS`:
          // Replace entry within state
          return state.set(
            indexOfEntry,
            Map({
              action: action.type,
              id: action.pathOrId,
              isFetching: false,
              success: true,
              response: action.response,
              response_prev: getPreviousResponse(state, indexOfEntry),
              message: action.message,
            })
          )

        case `${uck}_QUERY_ERROR`:
          // Add error message
          return state.set(
            indexOfEntry,
            Map({
              action: action.type,
              id: action.pathOrId,
              isFetching: false,
              isError: true,
              success: false,
              response: state.get(indexOfEntry).get('response'),
              response_prev: getPreviousResponse(state, indexOfEntry),
              message: action.message,
            })
          )

        default: // Note: do nothing
      }

      return state
    },
  }
}
export const computeOperation = (key = defaultKey) => {
  const uck = UPPER_CASE_KEY(key)
  return {
    [`compute${CAMEL_CASE_KEY(key)}`]: (state = new List([]), action) => {
      // Find entry within state based on id
      const indexOfEntry = state.findIndex((item) => {
        return item.get('id') === action.pathOrId
      })

      switch (action.type) {
        case `${uck}_EXECUTE_START`:
          // push or replace
          return state.set(
            getListIndexForPushOrReplace(state, indexOfEntry),
            Map({
              action: action.type,
              id: action.pathOrId,
              message: action.message,
              response_prev: getPreviousResponse(state, indexOfEntry),
              isFetching: true,
              success: false,
            })
          )

        case `${uck}_EXECUTE_SUCCESS`:
          // Replace entry within state
          return state.set(
            indexOfEntry,
            Map({
              action: action.type,
              id: action.pathOrId,
              isFetching: false,
              success: true,
              response: action.response,
              response_prev: getPreviousResponse(state, indexOfEntry),
              message: action.message,
            })
          )

        case `${uck}_EXECUTE_ERROR`:
          // Add error message
          return state.set(
            indexOfEntry,
            Map({
              action: action.type,
              id: action.pathOrId,
              isFetching: false,
              isError: true,
              success: false,
              response: state.get(indexOfEntry).get('response'),
              response_prev: getPreviousResponse(state, indexOfEntry),
              message: action.message,
            })
          )

        default: // NOTE: do nothing
      }

      return state
    },
  }
}
export const computeDelete = (key = defaultKey) => {
  const uck = UPPER_CASE_KEY(key)
  return {
    [`compute${CAMEL_CASE_KEY(key)}`]: (state = new List([]), action) => {
      // Find entry within state based on id
      const indexOfEntry = state.findIndex((item) => {
        return item.get('id') === action.pathOrId
      })

      switch (action.type) {
        case `${uck}_DELETE_START`:
          // push or replace
          return state.set(
            getListIndexForPushOrReplace(state, indexOfEntry),
            Map({
              action: action.type,
              id: action.pathOrId,
              message: action.message,
              response_prev: getPreviousResponse(state, indexOfEntry),
              isFetching: true,
              success: false,
            })
          )

        case `${uck}_DELETE_SUCCESS`:
          // Replace entry within state
          return state.set(
            indexOfEntry,
            Map({
              action: action.type,
              id: action.pathOrId,
              isFetching: false,
              success: true,
              response: action.response,
              response_prev: getPreviousResponse(state, indexOfEntry),
              message: action.message,
            })
          )

        case `${uck}_DELETE_ERROR`:
          // Add error message
          return state.set(
            indexOfEntry,
            Map({
              action: action.type,
              id: action.pathOrId,
              isFetching: false,
              isError: true,
              success: false,
              response: state.get(indexOfEntry).get('response'),
              response_prev: getPreviousResponse(state, indexOfEntry),
              message: action.message,
            })
          )

        default: // Note: do nothing
      }

      return state
    },
  }
}
