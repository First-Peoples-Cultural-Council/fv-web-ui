import { computeFetch, computeOperation } from 'reducers/rest'
import { combineReducers } from 'redux'

const computeUserFactory = computeFetch('user')
const computeUserSelfregisterOperation = computeOperation('user_selfregister')
const computeUserUpgradeOperation = computeOperation('user_upgrade')
const computeUserDialectsOperation = computeOperation('user_dialects')
const computeUserStartPageOperation = computeOperation('user_startpage')
const computeMembershipFactory = computeFetch('membership')
const computeJoinRequestFactory = computeFetch('join_request')
const computeJoinRequestsFactory = computeFetch('join_requests')

export const fvUserReducer = combineReducers({
  computeUser: computeUserFactory.computeUser,
  computeUserUpgrade: computeUserUpgradeOperation.computeUserUpgrade,
  computeUserSelfregister: computeUserSelfregisterOperation.computeUserSelfregister,
  computeUserDialects: computeUserDialectsOperation.computeUserDialects,
  computeUserStartpage: computeUserStartPageOperation.computeUserStartpage,
  computeMembership: computeMembershipFactory.computeMembership,
  computeJoinRequest: computeJoinRequestFactory.computeJoinRequest,
  computeJoinRequests: computeJoinRequestsFactory.computeJoinRequests,
})
