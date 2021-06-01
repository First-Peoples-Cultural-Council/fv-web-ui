import { computeFetch, computeOperation } from 'reducers/rest'
import { combineReducers } from 'redux'

const computeJoinRequestFactory = computeFetch('join_request')
const computeJoinRequestsFactory = computeFetch('join_requests')
const computeMembershipFetchFactory = computeFetch('membership_fetch')
const computeMembershipCreateOperation = computeFetch('membership_create')
const computeUserFactory = computeFetch('user')
const computeUserDialectsOperation = computeOperation('user_dialects')
const computeUserSelfregisterOperation = computeOperation('user_selfregister')
const computeUserStartPageOperation = computeOperation('user_startpage')
const computeUserUpgradeOperation = computeOperation('user_upgrade')

export const fvUserReducer = combineReducers({
  computeJoinRequest: computeJoinRequestFactory.computeJoinRequest,
  computeJoinRequests: computeJoinRequestsFactory.computeJoinRequests,
  computeMembershipFetch: computeMembershipFetchFactory.computeMembershipFetch,
  computeMembershipCreate: computeMembershipCreateOperation.computeMembershipCreate,
  computeUser: computeUserFactory.computeUser,
  computeUserDialects: computeUserDialectsOperation.computeUserDialects,
  computeUserSelfregister: computeUserSelfregisterOperation.computeUserSelfregister,
  computeUserStartpage: computeUserStartPageOperation.computeUserStartpage,
  computeUserUpgrade: computeUserUpgradeOperation.computeUserUpgrade,
})
