import { computeFetch, computeOperation } from 'reducers/rest'
import { combineReducers } from 'redux'

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
})
