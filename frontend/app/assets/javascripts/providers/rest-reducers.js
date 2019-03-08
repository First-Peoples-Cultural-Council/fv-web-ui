import Immutable, { List, Map } from 'immutable'

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
  return i == -1 ? s.size : i
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

export default {
  computeFetch: (key) => {
    return {
      ['compute' + CAMEL_CASE_KEY(key)]: (state = new List([]), action) => {
        // Find entry within state based on id
        const indexOfEntry = state.findIndex((item) => {
          return item.get('id') === action.pathOrId
        })

        switch (action.type) {
          case UPPER_CASE_KEY(key) + '_FETCH_START':
          case UPPER_CASE_KEY(key) + '_UPDATE_START':
          case UPPER_CASE_KEY(key) + '_CREATE_START':
          case UPPER_CASE_KEY(key) + '_PUBLISH_EXECUTE_START':
          case UPPER_CASE_KEY(key) + '_PUBLISH_WORKFLOW_EXECUTE_START':
          case UPPER_CASE_KEY(key) + '_UNPUBLISH_EXECUTE_START':
          case UPPER_CASE_KEY(key) + '_UNPUBLISH_WORKFLOW_EXECUTE_START':
          case UPPER_CASE_KEY(key) + '_ENABLE_EXECUTE_START':
          case UPPER_CASE_KEY(key) + '_ENABLE_WORKFLOW_EXECUTE_START':
          case UPPER_CASE_KEY(key) + '_DISABLE_EXECUTE_START':
          case UPPER_CASE_KEY(key) + '_DISABLE_WORKFLOW_EXECUTE_START':
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

            break

          case UPPER_CASE_KEY(key) + '_FETCH_SUCCESS':
          case UPPER_CASE_KEY(key) + '_UPDATE_SUCCESS':
          case UPPER_CASE_KEY(key) + '_CREATE_SUCCESS':
          case UPPER_CASE_KEY(key) + '_PUBLISH_EXECUTE_SUCCESS':
          case UPPER_CASE_KEY(key) + '_PUBLISH_WORKFLOW_EXECUTE_SUCCESS':
          case UPPER_CASE_KEY(key) + '_UNPUBLISH_EXECUTE_SUCCESS':
          case UPPER_CASE_KEY(key) + '_UNPUBLISH_WORKFLOW_EXECUTE_SUCCESS':
          case UPPER_CASE_KEY(key) + '_ENABLE_EXECUTE_SUCCESS':
          case UPPER_CASE_KEY(key) + '_ENABLE_WORKFLOW_EXECUTE_SUCCESS':
          case UPPER_CASE_KEY(key) + '_DISABLE_EXECUTE_SUCCESS':
          case UPPER_CASE_KEY(key) + '_DISABLE_WORKFLOW_EXECUTE_SUCCESS':
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

            break

          case UPPER_CASE_KEY(key) + '_FETCH_ERROR':
          case UPPER_CASE_KEY(key) + '_UPDATE_ERROR':
          case UPPER_CASE_KEY(key) + '_CREATE_ERROR':
          case UPPER_CASE_KEY(key) + '_PUBLISH_EXECUTE_ERROR':
          case UPPER_CASE_KEY(key) + '_PUBLISH_WORKFLOW_EXECUTE_ERROR':
          case UPPER_CASE_KEY(key) + '_UNPUBLISH_EXECUTE_ERROR':
          case UPPER_CASE_KEY(key) + '_UNPUBLISH_WORKFLOW_EXECUTE_ERROR':
          case UPPER_CASE_KEY(key) + '_ENABLE_EXECUTE_ERROR':
          case UPPER_CASE_KEY(key) + '_ENABLE_WORKFLOW_EXECUTE_ERROR':
          case UPPER_CASE_KEY(key) + '_DISABLE_EXECUTE_ERROR':
          case UPPER_CASE_KEY(key) + '_DISABLE_WORKFLOW_EXECUTE_ERROR':
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

            break
          default: // Note: do nothing
        }

        return state
      },
    }
  },
  computeQuery: (key) => {
    return {
      ['compute' + CAMEL_CASE_KEY(key)]: (state = new List([]), action) => {
        // Find entry within state based on id
        const indexOfEntry = state.findIndex((item) => {
          return item.get('id') === action.pathOrId
        })

        switch (action.type) {
          case UPPER_CASE_KEY(key) + '_QUERY_START':
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

            break

          case UPPER_CASE_KEY(key) + '_QUERY_SUCCESS':
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

            break

          case UPPER_CASE_KEY(key) + '_QUERY_ERROR':
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

            break
          default: // Note: do nothing
        }

        return state
      },
    }
  },
  computeOperation: (key) => {
    return {
      ['compute' + CAMEL_CASE_KEY(key)]: (state = new List([]), action) => {
        // Find entry within state based on id
        const indexOfEntry = state.findIndex((item) => {
          return item.get('id') === action.pathOrId
        })

        switch (action.type) {
          case UPPER_CASE_KEY(key) + '_EXECUTE_START':
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

            break

          case UPPER_CASE_KEY(key) + '_EXECUTE_SUCCESS':
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

            break

          case UPPER_CASE_KEY(key) + '_EXECUTE_ERROR':
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

            break
          default: // NOTE: do nothing
        }

        return state
      },
    }
  },
  computeDelete: (key) => {
    return {
      ['compute' + CAMEL_CASE_KEY(key)]: (state = new List([]), action) => {
        // Find entry within state based on id
        const indexOfEntry = state.findIndex((item) => {
          return item.get('id') === action.pathOrId
        })

        switch (action.type) {
          case UPPER_CASE_KEY(key) + '_DELETE_START':
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

            break

          case UPPER_CASE_KEY(key) + '_DELETE_SUCCESS':
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

            break

          case UPPER_CASE_KEY(key) + '_DELETE_ERROR':
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

            break
          default: // Note: do nothing
        }

        return state
      },
    }
  },
}
