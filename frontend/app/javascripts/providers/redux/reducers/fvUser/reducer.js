import { computeFetch, computeOperation } from 'providers/redux/reducers/rest'
import { combineReducers } from 'redux'

const computeUserFetchFactory = computeFetch('user')
const computeUserSuggestion = computeOperation('user_suggestion')
const computeUserSelfregisterOperation = computeOperation('user_selfregister')
const computeUserUpdate = computeOperation('user_update')
const computeUserUpgrade = computeOperation('user_upgrade')
const computeUserDialectsOperation = computeOperation('user_dialects')
const computeUserStartPageOperation = computeOperation('user_startpage')

export const fvUserReducer = combineReducers({
  computeUser: computeUserFetchFactory.computeUser,
  computeUserUpdate: computeUserUpdate.computeUserUpdate,
  computeUserUpgrade: computeUserUpgrade.computeUserUpgrade,
  computeUserSuggestion: computeUserSuggestion.computeUserSuggestion,
  computeUserSelfregister: computeUserSelfregisterOperation.computeUserSelfregister,
  computeUserDialects: computeUserDialectsOperation.computeUserDialects,
  computeUserStartpage: computeUserStartPageOperation.computeUserStartpage,
})
