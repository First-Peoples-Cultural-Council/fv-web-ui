import { execute } from 'providers/redux/reducers/rest'
import UserOperations from 'operations/UserOperations'
import IntlService from 'views/services/intl'

const key = 'FV_USER'
const intl = IntlService.instance

/**
 * Single User Actions
 */
export const fetchUser = function _fetchUser(
  username,
  messageStart = null,
  messageSuccess = null,
  messageError = null
) {
  return (dispatch) => {
    dispatch({
      type: key + '_FETCH_START',
      pathOrId: username,
      message: messageStart || intl.trans('providers.fetch_started', 'Loading', 'first') + '...',
    })

    return UserOperations.getUser(username, { headers: {} })
      .then((response) => {
        dispatch({
          type: key + '_FETCH_SUCCESS',
          message: messageSuccess,
          response: response,
          pathOrId: username,
        })
      })
      .catch((error) => {
        dispatch({ type: key + '_FETCH_ERROR', message: messageError || error, pathOrId: username })
      })
  }
}

export const createUser = function _createUser(user) {
  return (dispatch) => {
    dispatch({ type: key + '_CREATE_START', pathOrId: user.id, user: user })

    return UserOperations.createUser(user)
      .then((response) => {
        dispatch({
          type: key + '_CREATE_SUCCESS',
          message: intl.trans(
            'providers.user_account_created_successfully',
            'User account created successfully!',
            'first'
          ),
          response: response,
          user: user,
          pathOrId: user.id,
        })
      })
      .catch((error) => {
        dispatch({ type: key + '_CREATE_ERROR', message: error, user: user, pathOrId: user.id })
      })
  }
}

export const updateUser = function _updateUser(user) {
  return (dispatch) => {
    dispatch({ type: key + '_UPDATE_START', user: user, pathOrId: user.id })

    return UserOperations.updateUser(user)
      .then((response) => {
        dispatch({
          type: key + '_UPDATE_SUCCESS',
          message: intl.trans(
            'providers.user_account_updated_successfully',
            'User account updated successfully!',
            'first'
          ),
          response: response,
          user: user,
          pathOrId: user.id,
        })
      })
      .catch((error) => {
        dispatch({ type: key + '_UPDATE_ERROR', message: error, user: user, pathOrId: user.id })
      })
  }
}

export const selfregisterUser = execute('FV_USER_SELFREGISTER', 'User.SelfRegistration', {})

export const userSuggestion = execute('FV_USER_SUGGESTION', 'UserGroup.Suggestion', {
  headers: { 'enrichers.document': '' },
})

export const userUpdate = execute('FV_USER_UPDATE', 'FVUpdateUser')

export const userUpgrade = execute('FV_USER_UPGRADE', 'FVChangeUserGroupToDialectGroup', {})

export const fetchUserDialects = execute('FV_USER_DIALECTS', 'FVGetDialectsForUser')

export const fetchUserStartpage = execute('FV_USER_STARTPAGE', 'FVGetUserStartPage')
