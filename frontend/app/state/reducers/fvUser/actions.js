import { execute } from 'reducers/rest'
import DirectoryOperations from 'operations/DirectoryOperations'
import URLHelpers from 'common/URLHelpers'
import { FV_REQUEST_JOIN_PUT_START, FV_REQUEST_JOIN_PUT_SUCCESS, FV_REQUEST_JOIN_PUT_ERROR } from './actionTypes'

/**
 * Single User Actions
 */
export const selfregisterUser = execute('FV_USER_SELFREGISTER', 'User.SelfRegistration', {})

export const userUpgrade = execute('FV_USER_UPGRADE', 'FVChangeUserGroupToDialectGroup', {})

export const fetchUserDialects = execute('FV_USER_DIALECTS', 'FVGetDialectsForUser')

export const fetchUserStartpage = execute('FV_USER_STARTPAGE', 'FVGetUserStartPage')

export const requestJoin = ({ siteId, interestReason, communityMember, languageTeam, comment }) => {
  return (dispatch) => {
    dispatch({
      type: FV_REQUEST_JOIN_PUT_START,
      pathOrId: `api/v1/site/${siteId}/membership`,
      message: 'Request to join language site dispatched.',
    })

    return DirectoryOperations.putToAPI(`${URLHelpers.getBaseURL()}api/v1/site/${siteId}/membership`, {
      interestReason,
      communityMember,
      languageTeam,
      comment,
    })
      .then((response) => {
        dispatch({ type: FV_REQUEST_JOIN_PUT_SUCCESS, message: response })
        return response
      })
      .catch((error) => {
        dispatch({ type: FV_REQUEST_JOIN_PUT_ERROR, message: error })
        return error
      })
  }
}
