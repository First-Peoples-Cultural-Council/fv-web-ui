import { computeFetch, computeOperation } from 'reducers/rest'
import { combineReducers } from 'redux'
import { FV_REQUEST_JOIN_PUT_START, FV_REQUEST_JOIN_PUT_SUCCESS, FV_REQUEST_JOIN_PUT_ERROR } from './actionTypes'

const computeUserFetchFactory = computeFetch('user')
const computeUserSelfregisterOperation = computeOperation('user_selfregister')
const computeUserUpgrade = computeOperation('user_upgrade')
const computeUserDialectsOperation = computeOperation('user_dialects')
const computeUserStartPageOperation = computeOperation('user_startpage')

export const fvUserReducer = combineReducers({
  computeUser: computeUserFetchFactory.computeUser,
  computeUserUpgrade: computeUserUpgrade.computeUserUpgrade,
  computeUserSelfregister: computeUserSelfregisterOperation.computeUserSelfregister,
  computeUserDialects: computeUserDialectsOperation.computeUserDialects,
  computeUserStartpage: computeUserStartPageOperation.computeUserStartpage,
  computeRequestJoin(state, action) {
    switch (action.type) {
      case FV_REQUEST_JOIN_PUT_START:
        return {
          ...state,
          message: undefined,
          isFetching: true,
          isSuccess: undefined,
        }

      case FV_REQUEST_JOIN_PUT_SUCCESS:
        return {
          ...state,
          message: action.message,
          action: action,
          isFetching: false,
          isSuccess: true,
        }

      case FV_REQUEST_JOIN_PUT_ERROR:
        return {
          ...state,
          message: action.message,
          isFetching: false,
          isSuccess: false,
        }

      default:
        return state ? state : {}
    }
  },
})
