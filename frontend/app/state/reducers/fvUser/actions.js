import { execute } from 'reducers/rest'
import DirectoryOperations from 'operations/DirectoryOperations'
import URLHelpers from 'common/URLHelpers'
import {
  FV_JOIN_REQUEST_FETCH_START,
  FV_JOIN_REQUEST_FETCH_SUCCESS,
  FV_JOIN_REQUEST_FETCH_ERROR,
  FV_JOIN_REQUEST_UPDATE_START,
  FV_JOIN_REQUEST_UPDATE_SUCCESS,
  FV_JOIN_REQUEST_UPDATE_ERROR,
  FV_JOIN_REQUESTS_FETCH_START,
  FV_JOIN_REQUESTS_FETCH_SUCCESS,
  FV_JOIN_REQUESTS_FETCH_ERROR,
  FV_MEMBERSHIP_FETCH_START,
  FV_MEMBERSHIP_FETCH_SUCCESS,
  FV_MEMBERSHIP_FETCH_ERROR,
  FV_MEMBERSHIP_CREATE_START,
  FV_MEMBERSHIP_CREATE_SUCCESS,
  FV_MEMBERSHIP_CREATE_ERROR,
} from './actionTypes'

/**
 * Single User Actions
 */
export const selfregisterUser = execute('FV_USER_SELFREGISTER', 'User.SelfRegistration', {})

export const userUpgrade = execute('FV_USER_UPGRADE', 'FVChangeUserGroupToDialectGroup', {})

export const fetchUserDialects = execute('FV_USER_DIALECTS', 'FVGetDialectsForUser')

export const fetchUserStartpage = execute('FV_USER_STARTPAGE', 'FVGetUserStartPage')

export const requestMembership = ({ siteId, interestReason, communityMember, languageTeam, comment }) => {
  return (dispatch) => {
    dispatch({
      type: FV_MEMBERSHIP_CREATE_START,
      pathOrId: `api/v1/site/sections/${siteId}/membership`,
      message: 'Request to join language site dispatched.',
    })

    return DirectoryOperations.postToAPI(`${URLHelpers.getBaseURL()}api/v1/site/sections/${siteId}/membership`, {
      interestReason,
      communityMember,
      languageTeam,
      comment,
    })
      .then((response) => {
        dispatch({ type: FV_MEMBERSHIP_CREATE_SUCCESS, message: response })
        return response
      })
      .catch((error) => {
        dispatch({ type: FV_MEMBERSHIP_CREATE_ERROR, message: error })
        return error
      })
  }
}

export const getMembershipStatus = ({ siteId }) => {
  return (dispatch) => {
    dispatch({
      type: FV_MEMBERSHIP_FETCH_START,
      pathOrId: `api/v1/site/sections/${siteId}/membership`,
      message: 'Membership status enquiry dispatched.',
    })

    return DirectoryOperations.getFromApi(`${URLHelpers.getBaseURL()}api/v1/site/sections/${siteId}/membership`)
      .then((response) => {
        dispatch({ type: FV_MEMBERSHIP_FETCH_SUCCESS, message: response })
        return response
      })
      .catch((error) => {
        dispatch({ type: FV_MEMBERSHIP_FETCH_ERROR, message: error })
        return error
      })
  }
}

export const getJoinRequest = ({ siteId, requestId }) => {
  return (dispatch) => {
    dispatch({
      type: FV_JOIN_REQUEST_FETCH_START,
      pathOrId: `api/v1/site/sections/${siteId}/administration/joinRequests`,
      message: 'Request to join language site dispatched.',
    })

    return DirectoryOperations.getFromAPI(
      `${URLHelpers.getBaseURL()}api/v1/site/sections/${siteId}/administration/joinRequests/${requestId}`
    )
      .then((response) => {
        dispatch({ type: FV_JOIN_REQUEST_FETCH_SUCCESS, message: response })
        return response
      })
      .catch((error) => {
        dispatch({ type: FV_JOIN_REQUEST_FETCH_ERROR, message: error })
        return error
      })
  }
}

export const getJoinRequests = ({ siteId }) => {
  return (dispatch) => {
    dispatch({
      type: FV_JOIN_REQUESTS_FETCH_START,
      pathOrId: `api/v1/site/sections/${siteId}/administration`,
      message: 'Request to join language site dispatched.',
    })

    return DirectoryOperations.getFromAPI(
      `${URLHelpers.getBaseURL()}api/v1/site/sections/${siteId}/administration/joinRequests`
    )
      .then((response) => {
        dispatch({ type: FV_JOIN_REQUESTS_FETCH_SUCCESS, message: response })
        return response
      })
      .catch((error) => {
        dispatch({ type: FV_JOIN_REQUESTS_FETCH_ERROR, message: error })
        return error
      })
  }
}

// Value for newStatus can be 'ACCEPT' or 'IGNORE'
export const postJoinRequest = ({ siteId, requestId, newStatus, messageToUser }) => {
  return (dispatch) => {
    dispatch({
      type: FV_JOIN_REQUEST_UPDATE_START,
      pathOrId: `api/v1/site/sections/${siteId}/administration/joinRequests`,
      message: 'Request to join language site dispatched.',
    })

    return DirectoryOperations.postToAPI(
      `${URLHelpers.getBaseURL()}api/v1/site/sections/${siteId}/administration/joinRequests/${requestId}`,
      {
        newStatus,
        messageToUser,
      }
    )
      .then((response) => {
        dispatch({ type: FV_JOIN_REQUEST_UPDATE_SUCCESS, message: response })
        return response
      })
      .catch((error) => {
        dispatch({ type: FV_JOIN_REQUEST_UPDATE_ERROR, message: error })
        return error
      })
  }
}
