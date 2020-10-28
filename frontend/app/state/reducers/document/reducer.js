import { computeFetch, computeOperation } from 'reducers/rest'
import { combineReducers } from 'redux'
import {
  DISMISS_ERROR,
  DOCUMENT_PUBLISH_START,
  DOCUMENT_PUBLISH_SUCCESS,
  DOCUMENT_PUBLISH_ERROR,
  DOCUMENT_DISABLE_START,
  DOCUMENT_DISABLE_SUCCESS,
  DOCUMENT_DISABLE_ERROR,
  DOCUMENT_ENABLE_START,
  DOCUMENT_ENABLE_SUCCESS,
  DOCUMENT_ENABLE_ERROR,
} from './actionTypes'
const initialState = {
  isFetching: false,
  response: {
    get: () => '',
  },
  success: false,
}
const _computeDocumentFetchFactory = computeFetch('document')
const _computeResultSetOperation = computeOperation('result_set')
const _computeSourceDocument = computeOperation('source_document')

const computeDocument = _computeDocumentFetchFactory.computeDocument

const computeResultSet = _computeResultSetOperation.computeResultSet

const computeSourceDocument = _computeSourceDocument.computeSourceDocument

const computePublish = (state = initialState, action) => {
  switch (action.type) {
    case DOCUMENT_PUBLISH_START:
      return { ...state, isFetching: true, success: false }

    case DOCUMENT_PUBLISH_SUCCESS:
      return { ...state, response: action.document, isFetching: false, success: true }

    case DOCUMENT_PUBLISH_ERROR:
    case DISMISS_ERROR:
      return {
        ...state,
        isFetching: false,
        isError: true,
        error: action.error,
        errorDismissed: action.type === DISMISS_ERROR ? true : false,
      }

    default:
      return { ...state, isFetching: false }
  }
}

const computeDocumentDisable = (state = initialState, action) => {
  switch (action.type) {
    case DOCUMENT_DISABLE_START:
      return { ...state, isFetching: true, success: false }

    case DOCUMENT_DISABLE_SUCCESS:
      return { ...state, response: action.document, isFetching: false, success: true }

    case DOCUMENT_DISABLE_ERROR:
      return { ...state, isFetching: false, isError: true, error: action.error }

    default:
      return { ...state, isFetching: false }
  }
}

const computeDocumentEnable = (state = initialState, action) => {
  switch (action.type) {
    case DOCUMENT_ENABLE_START:
      return { ...state, isFetching: true, success: false }

    case DOCUMENT_ENABLE_SUCCESS:
      return { ...state, response: action.document, isFetching: false, success: true }

    case DOCUMENT_ENABLE_ERROR:
      return { ...state, isFetching: false, isError: true, error: action.error }

    default:
      return { ...state, isFetching: false }
  }
}

// export const documentReducer = {
//   computeDocument,
//   computeResultSet,
//   computeSourceDocument,
//   computePublish,
//   computeDocumentDisable,
//   computeDocumentEnable,
// }
export const documentReducer = combineReducers({
  computeDocument,
  computeResultSet,
  computeSourceDocument,
  computePublish,
  computeDocumentDisable,
  computeDocumentEnable,
})
