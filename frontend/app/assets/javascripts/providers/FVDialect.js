import RESTActions from "./rest-actions"
import RESTReducers from "./rest-reducers"

// Middleware
import thunk from "redux-thunk"

// Operations
import DirectoryOperations from "operations/DirectoryOperations"
import DocumentOperations from "operations/DocumentOperations"

const DISMISS_ERROR = "DISMISS_ERROR"

/**
 * Multiple Dialect Actions
 */
const FV_DIALECTS_FETCH_START = "FV_DIALECTS_FETCH_START"
const FV_DIALECTS_FETCH_SUCCESS = "FV_DIALECTS_FETCH_SUCCESS"
const FV_DIALECTS_FETCH_ERROR = "FV_DIALECTS_FETCH_ERROR"

const FV_DIALECTS_UPDATE_START = "FV_DIALECTS_UPDATE_START"
const FV_DIALECTS_UPDATE_SUCCESS = "FV_DIALECTS_UPDATE_SUCCESS"
const FV_DIALECTS_UPDATE_ERROR = "FV_DIALECTS_UPDATE_ERROR"

const FV_DIALECTS_CREATE_START = "FV_DIALECTS_CREATE_START"
const FV_DIALECTS_CREATE_SUCCESS = "FV_DIALECTS_CREATE_SUCCESS"
const FV_DIALECTS_CREATE_ERROR = "FV_DIALECTS_CREATE_ERROR"

const FV_DIALECTS_DELETE_START = "FV_DIALECTS_DELETE_START"
const FV_DIALECTS_DELETE_SUCCESS = "FV_DIALECTS_DELETE_SUCCESS"
const FV_DIALECTS_DELETE_ERROR = "FV_DIALECTS_DELETE_ERROR"

/**
 * Single Dialect Actions
 */

const FV_DIALECT_FETCH_START = "FV_DIALECT_FETCH_START"
const FV_DIALECT_FETCH_SUCCESS = "FV_DIALECT_FETCH_SUCCESS"
const FV_DIALECT_FETCH_ERROR = "FV_DIALECT_FETCH_ERROR"

const FV_DIALECT_FETCH_ALL_START = "FV_DIALECT_FETCH_ALL_START"
const FV_DIALECT_FETCH_ALL_SUCCESS = "FV_DIALECT_FETCH_ALL_SUCCESS"
const FV_DIALECT_FETCH_ALL_ERROR = "FV_DIALECT_FETCH_ALL_ERROR"

const FV_DIALECT_UPDATE_START = "FV_DIALECT_UPDATE_START"
const FV_DIALECT_UPDATE_SUCCESS = "FV_DIALECT_UPDATE_SUCCESS"
const FV_DIALECT_UPDATE_ERROR = "FV_DIALECT_UPDATE_ERROR"

const FV_DIALECT_CREATE_START = "FV_DIALECT_CREATE_START"
const FV_DIALECT_CREATE_SUCCESS = "FV_DIALECT_CREATE_SUCCESS"
const FV_DIALECT_CREATE_ERROR = "FV_DIALECT_CREATE_ERROR"

const FV_DIALECT_DELETE_START = "FV_DIALECT_DELETE_START"
const FV_DIALECT_DELETE_SUCCESS = "FV_DIALECT_DELETE_SUCCESS"
const FV_DIALECT_DELETE_ERROR = "FV_DIALECT_DELETE_ERROR"

const FV_DIALECT_PUBLISH_START = "FV_DIALECT_PUBLISH_START"
const FV_DIALECT_PUBLISH_SUCCESS = "FV_DIALECT_PUBLISH_SUCCESS"
const FV_DIALECT_PUBLISH_ERROR = "FV_DIALECT_PUBLISH_ERROR"

const FV_DIALECT_UNPUBLISH_START = "FV_DIALECT_UNPUBLISH_START"
const FV_DIALECT_UNPUBLISH_SUCCESS = "FV_DIALECT_UNPUBLISH_SUCCESS"
const FV_DIALECT_UNPUBLISH_ERROR = "FV_DIALECT_UNPUBLISH_ERROR"

const fetchDialect = function fetchDialect(pathOrId) {
  return (dispatch) => {
    dispatch({ type: FV_DIALECT_FETCH_START })

    return DocumentOperations.getDocument(pathOrId, "FVDialect", {
      headers: { "X-NXenrichers.document": "ancestry,dialect,permissions,acls" },
    })
      .then((response) => {
        dispatch({ type: FV_DIALECT_FETCH_SUCCESS, document: response })
      })
      .catch((error) => {
        dispatch({ type: FV_DIALECT_FETCH_ERROR, error: error })
      })
  }
}

const updateDialect2 = RESTActions.update("FV_DIALECT2", "FVDialect", {
  headers: { "X-NXenrichers.document": "ancestry,dialect,permissions,acls" },
})
const fetchDialect2 = RESTActions.fetch("FV_DIALECT2", "FVDialect", {
  headers: { "X-NXenrichers.document": "ancestry,dialect,permissions,acls" },
})
const queryDialect2 = RESTActions.query("FV_DIALECT2_QUERY", "FVDialect", {})
const queryDialect2ByShortURL = RESTActions.query("FV_DIALECT2_SHORTURL", "FVDialect", {})
const fetchDialectStats = RESTActions.execute("FV_DIALECT_STATS", "FVGenerateJsonStatistics", {})
const fetchDialects = RESTActions.query("FV_DIALECTS", "FVDialect", {
  headers: { "X-NXenrichers.document": "ancestry,dialect" },
})
const fetchDialectList = RESTActions.execute("FV_DIALECT_LIST", "Document.ListDialects", {})
const publishDialect = RESTActions.execute("FV_DIALECT2_PUBLISH", "FVPublish", {
  headers: { "X-NXenrichers.document": "ancestry,dialect,permissions,acls" },
})
const publishDialectOnly = RESTActions.execute("FV_DIALECT2_PUBLISH", "Document.PublishToSection", {
  headers: { "X-NXenrichers.document": "ancestry,dialect,permissions,acls" },
})
const unpublishDialect = RESTActions.execute("FV_DIALECT2_UNPUBLISH", "FVUnpublishDialect", {
  headers: { "X-NXenrichers.document": "ancestry,dialect,permissions,acls" },
})
const enableDialect = RESTActions.execute("FV_DIALECT2_ENABLE", "FVEnableDocument", {
  headers: { "X-NXenrichers.document": "ancestry,dialect,permissions,acls" },
})
const disableDialect = RESTActions.execute("FV_DIALECT2_DISABLE", "FVDisableDocument", {
  headers: { "X-NXenrichers.document": "ancestry,dialect,permissions,acls" },
})

const actions = {
  fetchDialect,
  queryDialect2,
  queryDialect2ByShortURL,
  updateDialect2,
  fetchDialect2,
  publishDialect,
  publishDialectOnly,
  unpublishDialect,
  fetchDialectList,
  fetchDialects,
  fetchDialectStats,
  enableDialect,
  disableDialect,
}

const computeDialectsQuery = RESTReducers.computeQuery("dialects")
const computeDialectQuery = RESTReducers.computeQuery("dialect2_query")
const computeDialectByShortURL = RESTReducers.computeQuery("dialect2_shorturl")
const computeDialectFetch = RESTReducers.computeFetch("dialect2")
const computeDialectStatsOperation = RESTReducers.computeOperation("dialect_stats")
const computeDialectListOperation = RESTReducers.computeOperation("dialect_list")

const reducers = {
  computeDialect(
    state = {
      isFetching: false,
      response: {
        get: () => "",
      },
      success: false,
    },
    action
  ) {
    switch (action.type) {
      case FV_DIALECT_FETCH_START:
      case FV_DIALECT_UPDATE_START:
        return Object.assign({}, state, { isFetching: true, success: false })
        break

      // Send modified document to UI without access REST end-point
      case FV_DIALECT_FETCH_SUCCESS:
      case FV_DIALECT_UPDATE_SUCCESS:
        return Object.assign({}, { response: action.document, isFetching: false, success: true })
        break

      // Send modified document to UI without access REST end-point
      case FV_DIALECT_FETCH_ERROR:
      case FV_DIALECT_UPDATE_ERROR:
      case DISMISS_ERROR:
        return Object.assign({}, state, {
          isFetching: false,
          isError: true,
          error: action.error,
          errorDismissed: action.type === DISMISS_ERROR ? true : false,
        })
        break

      default:
        return Object.assign({}, state, { isFetching: false })
        break
    }
  },

  computeDialect2Query: computeDialectQuery.computeDialect2Query,
  computeDialect2ByShortURL: computeDialectByShortURL.computeDialect2Shorturl,
  computeDialects: computeDialectsQuery.computeDialects,
  computeDialect2: computeDialectFetch.computeDialect2,
  computeDialectStats: computeDialectStatsOperation.computeDialectStats,
  computeDialectList: computeDialectListOperation.computeDialectList,
  computeDialectUnpublish(
    state = {
      isFetching: false,
      response: {
        get: () => "",
      },
      success: false,
    },
    action
  ) {
    switch (action.type) {
      case FV_DIALECT_UNPUBLISH_START:
        return Object.assign({}, state, { isFetching: true, success: false })
        break

      case FV_DIALECT_UNPUBLISH_SUCCESS:
        return Object.assign({}, state, { response: action.document, isFetching: false, success: true })
        break

      case FV_DIALECT_UNPUBLISH_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error })
        break

      default:
        return Object.assign({}, state, { isFetching: false })
        break
    }
  },
}

const middleware = [thunk]

export default { actions, reducers, middleware }
