import { computeFetch, computeOperation } from 'reducers/rest'
import { combineReducers } from 'redux'

import {
  FV_JOIN_REQUESTS_FETCH_START,
  FV_JOIN_REQUESTS_FETCH_SUCCESS,
  FV_JOIN_REQUESTS_FETCH_ERROR,
  FV_JOIN_REQUEST_UPDATE_START,
  FV_JOIN_REQUEST_UPDATE_SUCCESS,
  FV_JOIN_REQUEST_UPDATE_ERROR,
  FV_MEMBERSHIP_CREATE_START,
  FV_MEMBERSHIP_CREATE_SUCCESS,
  FV_MEMBERSHIP_CREATE_ERROR,
  FV_MEMBERSHIP_FETCH_START,
  FV_MEMBERSHIP_FETCH_SUCCESS,
  FV_MEMBERSHIP_FETCH_ERROR,
} from './actionTypes'

const computeJoinRequestFactory = computeFetch('join_request')
const computeUserFactory = computeFetch('user')
const computeUserDialectsOperation = computeOperation('user_dialects')
const computeUserSelfregisterOperation = computeOperation('user_selfregister')
const computeUserStartPageOperation = computeOperation('user_startpage')
const computeUserUpgradeOperation = computeOperation('user_upgrade')

export const fvUserReducer = combineReducers({
  computeMembershipCreate(state = { isFetching: false, message: null, success: false }, action) {
    switch (action.type) {
      case FV_MEMBERSHIP_CREATE_START:
        return { ...state, isFetching: true }

      // Send modified document to UI without access REST end-point
      case FV_MEMBERSHIP_CREATE_SUCCESS:
        return { ...state, message: action.message, isFetching: false, success: true }

      // Send modified document to UI without access REST end-point
      case FV_MEMBERSHIP_CREATE_ERROR:
        return {
          ...state,
          isFetching: false,
          isError: true,
          error: action.message,
        }

      default:
        return { ...state, isFetching: false }
    }
  },
  computeMembershipFetch(state = { isFetching: false, message: null, success: false }, action) {
    switch (action.type) {
      case FV_MEMBERSHIP_FETCH_START:
        return { ...state, isFetching: true }

      // Send modified document to UI without access REST end-point
      case FV_MEMBERSHIP_FETCH_SUCCESS:
        return { ...state, message: action.message, isFetching: false, success: true }

      // Send modified document to UI without access REST end-point
      case FV_MEMBERSHIP_FETCH_ERROR:
        return {
          ...state,
          isFetching: false,
          isError: true,
          error: action.message,
        }

      default:
        return { ...state, isFetching: false }
    }
  },
  computeUpdateJoinRequest(state = { isFetching: false, message: null, success: false }, action) {
    switch (action.type) {
      case FV_JOIN_REQUEST_UPDATE_START:
        return { ...state, isFetching: true }

      // Send modified document to UI without access REST end-point
      case FV_JOIN_REQUEST_UPDATE_SUCCESS:
        return { ...state, message: action.message, isFetching: false, success: true }

      // Send modified document to UI without access REST end-point
      case FV_JOIN_REQUEST_UPDATE_ERROR:
        return {
          ...state,
          isFetching: false,
          isError: true,
          error: action.message,
        }

      default:
        return { ...state, isFetching: false }
    }
  },
  computeJoinRequests(state = { isFetching: false, message: null, success: false }, action) {
    switch (action.type) {
      case FV_JOIN_REQUESTS_FETCH_START:
        return { ...state, isFetching: true }

      // Send modified document to UI without access REST end-point
      case FV_JOIN_REQUESTS_FETCH_SUCCESS:
        return { ...state, message: action.message, isFetching: false, success: true }

      // Send modified document to UI without access REST end-point
      case FV_JOIN_REQUESTS_FETCH_ERROR:
        return {
          ...state,
          isFetching: false,
          isError: true,
          error: action.message,
        }

      default:
        return { ...state, isFetching: false }
    }
  },
  computeJoinRequest: computeJoinRequestFactory.computeJoinRequest,
  computeUser: computeUserFactory.computeUser,
  computeUserDialects: computeUserDialectsOperation.computeUserDialects,
  computeUserSelfregister: computeUserSelfregisterOperation.computeUserSelfregister,
  computeUserStartpage: computeUserStartPageOperation.computeUserStartpage,
  computeUserUpgrade: computeUserUpgradeOperation.computeUserUpgrade,
})
