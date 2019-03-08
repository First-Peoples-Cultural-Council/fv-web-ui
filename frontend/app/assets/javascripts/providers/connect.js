// Middleware
import thunk from "redux-thunk"
import Request from "request"

// Configuration
import ConfGlobal from "conf/local.json"

// Operations
import BaseOperations from "operations/BaseOperations"
import UserOperations from "operations/UserOperations"

// Actions
const CONNECT = "CONNECT"

const GET_CURRENT_USER_START = "GET_CURRENT_USER_START"
const GET_CURRENT_USER_SUCCESS = "GET_CURRENT_USER_SUCCESS"
const GET_CURRENT_USER_ERROR = "GET_CURRENT_USER_ERROR"

let isNewLoginValue = false

/**
 * Actions: Represent that something happened
 */
const connect = function connect() {
  return function(dispatch) {
    BaseOperations.initClient()
    dispatch({ type: CONNECT })
  }
}

const getCurrentUser = function getCurrentUser() {
  return function(dispatch) {
    dispatch({ type: GET_CURRENT_USER_START })

    return UserOperations.getCurrentUser()
      .then((response) => {
        dispatch({ type: GET_CURRENT_USER_SUCCESS, user: response, isAnonymous: response.isAnonymous })
      })
      .catch((error) => {
        dispatch({ type: GET_CURRENT_USER_ERROR, error: error })
      })
  }
}

const actions = { connect, getCurrentUser }

/**
 * Reducers: Handle state changes based on an action
 */
const reducers = {
  connect(state = { isConnected: false }, action) {
    switch (action.type) {
      case CONNECT:
        return Object.assign({}, state, {
          isConnected: true,
          client: action.client,
        })
    }
    return { state }
  },

  computeLogin(
    state = {
      isFetching: false,
      response: {
        get: function() {
          return ""
        },
      },
      success: false,
    },
    action
  ) {
    switch (action.type) {
      case GET_CURRENT_USER_SUCCESS:
        let newLoginValue = isNewLoginValue
        isNewLoginValue = false
        return Object.assign({}, state, {
          response: action.user,
          isFetching: false,
          success: true,
          isConnected: !action.isAnonymous,
          isNewLogin: newLoginValue,
        })
        break

      default:
        return Object.assign({}, state, { isFetching: false })
        break
    }
  },
}

const middleware = [thunk]

export default { actions, reducers, middleware }
