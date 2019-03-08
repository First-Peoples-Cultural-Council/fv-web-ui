import RESTActions from "./rest-actions"
import RESTReducers from "./rest-reducers"

// Middleware
import thunk from "redux-thunk"

// Operations
import DirectoryOperations from "operations/DirectoryOperations"
import DocumentOperations from "operations/DocumentOperations"
import UserOperations from "operations/UserOperations"
import IntlService from "views/services/intl"

const key = "FV_USER"
const intl = IntlService.instance

/**
 * Single User Actions
 */
const fetchUser = function fetch(username, messageStart = null, messageSuccess = null, messageError = null) {
  return function(dispatch) {
    dispatch({
      type: key + "_FETCH_START",
      pathOrId: username,
      message: messageStart || intl.trans("providers.fetch_started", "Loading", "first") + "...",
    })

    return UserOperations.getUser(username, { headers: {} })
      .then((response) => {
        dispatch({
          type: key + "_FETCH_SUCCESS",
          message: messageSuccess,
          response: response,
          pathOrId: username,
        })
      })
      .catch((error) => {
        dispatch({ type: key + "_FETCH_ERROR", message: messageError || error, pathOrId: username })
      })
  }
}

const createUser = function create(user) {
  return function(dispatch) {
    dispatch({ type: key + "_CREATE_START", pathOrId: user.id, user: user })

    return UserOperations.createUser(user)
      .then((response) => {
        dispatch({
          type: key + "_CREATE_SUCCESS",
          message: intl.trans(
            "providers.user_account_created_successfully",
            "User account created successfully!",
            "first"
          ),
          response: response,
          user: user,
          pathOrId: user.id,
        })
      })
      .catch((error) => {
        dispatch({ type: key + "_CREATE_ERROR", message: error, user: user, pathOrId: user.id })
      })
  }
}

const updateUser = function update(user) {
  return function(dispatch) {
    dispatch({ type: key + "_UPDATE_START", user: user, pathOrId: user.id })

    return UserOperations.updateUser(user)
      .then((response) => {
        dispatch({
          type: key + "_UPDATE_SUCCESS",
          message: intl.trans(
            "providers.user_account_updated_successfully",
            "User account updated successfully!",
            "first"
          ),
          response: response,
          user: user,
          pathOrId: user.id,
        })
      })
      .catch((error) => {
        dispatch({ type: key + "_UPDATE_ERROR", message: error, user: user, pathOrId: user.id })
      })
  }
}

const selfregisterUser = RESTActions.execute("FV_USER_SELFREGISTER", "User.SelfRegistration", {})
const userSuggestion = RESTActions.execute("FV_USER_SUGGESTION", "UserGroup.Suggestion", {
  headers: { "X-NXenrichers.document": "" },
})
const userUpdate = RESTActions.execute("FV_USER_UPDATE", "FVUpdateUser")
const userUpgrade = RESTActions.execute("FV_USER_UPGRADE", "FVChangeUserGroupToDialectGroup", {})

const fetchUserDialects = RESTActions.execute("FV_USER_DIALECTS", "FVGetDialectsForUser")

const computeUserFetchFactory = RESTReducers.computeFetch("user")
const computeUserSuggestion = RESTReducers.computeOperation("user_suggestion")

const computeUserSelfregisterOperation = RESTReducers.computeOperation("user_selfregister")
const computeUserUpdate = RESTReducers.computeOperation("user_update")
const computeUserUpgrade = RESTReducers.computeOperation("user_upgrade")
const computeUserDialectsOperation = RESTReducers.computeOperation("user_dialects")

const actions = {
  fetchUser,
  userSuggestion,
  fetchUserDialects,
  createUser,
  selfregisterUser,
  updateUser,
  userUpdate,
  userUpgrade,
}

const reducers = {
  computeUser: computeUserFetchFactory.computeUser,
  computeUserUpdate: computeUserUpdate.computeUserUpdate,
  computeUserUpgrade: computeUserUpgrade.computeUserUpgrade,
  computeUserSuggestion: computeUserSuggestion.computeUserSuggestion,
  computeUserSelfregister: computeUserSelfregisterOperation.computeUserSelfregister,
  computeUserDialects: computeUserDialectsOperation.computeUserDialects,
}

const middleware = [thunk]

export default { actions, reducers, middleware }
