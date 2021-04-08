import { fetch, execute } from 'reducers/rest'
import DocumentOperations from 'operations/DocumentOperations'
// console.log('! document', { RESTActions, DocumentOperations }) // eslint-disable-line
import { DOCUMENT_PUBLISH_START, DOCUMENT_PUBLISH_SUCCESS, DOCUMENT_PUBLISH_ERROR } from './actionTypes'

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

export const fetchDocument = fetch('FV_DOCUMENT', 'Document', {
  headers: { 'enrichers.document': 'ancestry,permissions,acls' },
})

export const fetchResultSet = execute('FV_RESULT_SET', 'Repository.ResultSetQuery')

export const fetchSourceDocument = execute('FV_SOURCE_DOCUMENT', 'Proxy.GetSourceDocument')
