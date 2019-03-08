import RESTActions from './rest-actions'
import RESTReducers from './rest-reducers'

// Middleware
import thunk from 'redux-thunk'

// Operations
import DocumentOperations from 'operations/DocumentOperations'

const DISMISS_ERROR = 'DISMISS_ERROR'

/**
 * Single Document Actions
 */
const DOCUMENT_FETCH_START = 'DOCUMENT_FETCH_START'
const DOCUMENT_FETCH_SUCCESS = 'DOCUMENT_FETCH_SUCCESS'
const DOCUMENT_FETCH_ERROR = 'DOCUMENT_FETCH_ERROR'

const DOCUMENT_PUBLISH_START = 'DOCUMENT_PUBLISH_START'
const DOCUMENT_PUBLISH_SUCCESS = 'DOCUMENT_PUBLISH_SUCCESS'
const DOCUMENT_PUBLISH_ERROR = 'DOCUMENT_PUBLISH_ERROR'

const DOCUMENT_DISABLE_START = 'DOCUMENT_DISABLE_START'
const DOCUMENT_DISABLE_SUCCESS = 'DOCUMENT_DISABLE_SUCCESS'
const DOCUMENT_DISABLE_ERROR = 'DOCUMENT_DISABLE_ERROR'

const DOCUMENT_ENABLE_START = 'DOCUMENT_ENABLE_START'
const DOCUMENT_ENABLE_SUCCESS = 'DOCUMENT_ENABLE_SUCCESS'
const DOCUMENT_ENABLE_ERROR = 'DOCUMENT_ENABLE_ERROR'

/*const fetchDocument = function fetchDocument(pathOrId, headers) {
return function (dispatch) {

dispatch( { type: DOCUMENT_FETCH_START } );

return DocumentOperations.getDocument(pathOrId, 'Document', { headers: headers })
.then((response) => {
dispatch( { type: DOCUMENT_FETCH_SUCCESS, document: response } )
}).catch((error) => {
dispatch( { type: DOCUMENT_FETCH_ERROR, error: error } )
});
}
};*/

const publishDocument = function publishDocument(workspaceDocPath, sectionTargetPath) {
  return (dispatch) => {
    dispatch({ type: DOCUMENT_PUBLISH_START })

    return DocumentOperations.publishDocument(workspaceDocPath, { target: sectionTargetPath, override: 'true' })
      .then((response) => {
        dispatch({ type: DOCUMENT_PUBLISH_SUCCESS, document: response })
      })
      .catch((error) => {
        dispatch({ type: DOCUMENT_PUBLISH_ERROR, error: error })
      })
  }
}

const disableDocument = function disableDocument(pathOrId) {
  return (dispatch) => {
    dispatch({ type: DOCUMENT_DISABLE_START })

    return DocumentOperations.disableDocument(pathOrId)
      .then((response) => {
        dispatch({ type: DOCUMENT_DISABLE_SUCCESS, document: response })
      })
      .catch((error) => {
        dispatch({ type: DOCUMENT_DISABLE_ERROR, error: error })
      })
  }
}

const enableDocument = function enableDocument(pathOrId) {
  return (dispatch) => {
    dispatch({ type: DOCUMENT_ENABLE_START })

    return DocumentOperations.enableDocument(pathOrId)
      .then((response) => {
        dispatch({ type: DOCUMENT_ENABLE_SUCCESS, document: response })
      })
      .catch((error) => {
        dispatch({ type: DOCUMENT_ENABLE_ERROR, error: error })
      })
  }
}

const fetchDocument = RESTActions.fetch('FV_DOCUMENT', 'Document', {
  headers: { 'X-NXenrichers.document': 'ancestry,permissions,acls' },
})
const fetchResultSet = RESTActions.execute('FV_RESULT_SET', 'Repository.ResultSetQuery')
const fetchSourceDocument = RESTActions.execute('FV_SOURCE_DOCUMENT', 'Proxy.GetSourceDocument')

const computeDocumentFetchFactory = RESTReducers.computeFetch('document')
const computeResultSetOperation = RESTReducers.computeOperation('result_set')
const computeSourceDocument = RESTReducers.computeOperation('source_document')

const actions = { fetchDocument, fetchSourceDocument, publishDocument, disableDocument, enableDocument, fetchResultSet }

const reducers = {
  computeDocument: computeDocumentFetchFactory.computeDocument,
  computeResultSet: computeResultSetOperation.computeResultSet,
  computeSourceDocument: computeSourceDocument.computeSourceDocument,
  computePublish(
    state = {
      isFetching: false,
      response: {
        get: () => '',
      },
      success: false,
    },
    action
  ) {
    switch (action.type) {
      case DOCUMENT_PUBLISH_START:
        return Object.assign({}, state, { isFetching: true, success: false })
        break

      case DOCUMENT_PUBLISH_SUCCESS:
        return Object.assign({}, state, { response: action.document, isFetching: false, success: true })
        break

      case DOCUMENT_PUBLISH_ERROR:
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
  computeDocumentDisable(
    state = {
      isFetching: false,
      response: {
        get: () => '',
      },
      success: false,
    },
    action
  ) {
    switch (action.type) {
      case DOCUMENT_DISABLE_START:
        return Object.assign({}, state, { isFetching: true, success: false })
        break

      case DOCUMENT_DISABLE_SUCCESS:
        return Object.assign({}, state, { response: action.document, isFetching: false, success: true })
        break

      case DOCUMENT_DISABLE_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error })
        break

      default:
        return Object.assign({}, state, { isFetching: false })
        break
    }
  },
  computeDocumentEnable(
    state = {
      isFetching: false,
      response: {
        get: () => '',
      },
      success: false,
    },
    action
  ) {
    switch (action.type) {
      case DOCUMENT_ENABLE_START:
        return Object.assign({}, state, { isFetching: true, success: false })
        break

      case DOCUMENT_ENABLE_SUCCESS:
        return Object.assign({}, state, { response: action.document, isFetching: false, success: true })
        break

      case DOCUMENT_ENABLE_ERROR:
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
