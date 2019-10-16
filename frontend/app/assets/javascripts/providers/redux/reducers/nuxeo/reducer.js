import { CONNECT, GET_CURRENT_USER_SUCCESS, GET_CURRENT_USER_START,
  GET_CURRENT_USER_ERROR } from './actionTypes'
import { combineReducers } from 'redux'

let isNewLoginValue = false
export const nuxeoReducer = combineReducers({
  connect: (state = { isConnected: false }, action = {}) => {
    switch (action.type) {
      case CONNECT:
        return {
          ...state,
          isConnected: true,
          client: action.client,
        }
      default:
        return state
    }
  },

  computeLogin: (
    state = {
      isFetching: false,
      hasFetched: false,
      response: {
        get: () => {
          return ''
        },
      },
      success: false,
    },
    action = {}
  ) => {
    switch (action.type) {
      case GET_CURRENT_USER_START: {
        return {
          ...state,
          isFetching: true,
        }
      }
      case GET_CURRENT_USER_SUCCESS: {
        const newLoginValue = isNewLoginValue
        isNewLoginValue = false
        return {
          ...state,
          response: action.user,
          isFetching: false,
          hasFetched: true,
          success: true,
          isConnected: !action.isAnonymous,
          isNewLogin: newLoginValue,
        }
      }
      case GET_CURRENT_USER_ERROR: {
        return { ...state, isFetching: false, hasFetched: true }
      }

      default:
        return state
    }
  },
})
