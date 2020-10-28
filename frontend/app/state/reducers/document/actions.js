import { fetch, execute } from 'reducers/rest'
import DocumentOperations from 'operations/DocumentOperations'
// console.log('! document', { RESTActions, DocumentOperations }) // eslint-disable-line
import {
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

export const publishDocument = (workspaceDocPath, sectionTargetPath) => {
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

export const disableDocument = (pathOrId) => {
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

export const enableDocument = (pathOrId) => {
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

export const fetchDocument = fetch('FV_DOCUMENT', 'Document', {
  headers: { 'enrichers.document': 'ancestry,permissions,acls' },
})

export const fetchResultSet = execute('FV_RESULT_SET', 'Repository.ResultSetQuery')

export const fetchSourceDocument = execute('FV_SOURCE_DOCUMENT', 'Proxy.GetSourceDocument')
