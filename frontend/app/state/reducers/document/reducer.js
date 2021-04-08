import { computeFetch, computeOperation } from 'reducers/rest'
import { combineReducers } from 'redux'
import { DISMISS_ERROR, DOCUMENT_PUBLISH_START, DOCUMENT_PUBLISH_SUCCESS, DOCUMENT_PUBLISH_ERROR } from './actionTypes'
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

// export const documentReducer = {
//   computeDocument,
//   computeResultSet,
//   computeSourceDocument,
//   computePublish,
// }
export const documentReducer = combineReducers({
  computeDocument,
  computeResultSet,
  computeSourceDocument,
  computePublish,
})
