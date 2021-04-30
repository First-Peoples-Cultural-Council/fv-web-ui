import { create, _delete, execute, fetch, update } from 'reducers/rest'
import DocumentOperations from 'operations/DocumentOperations'

import { DOCUMENT_PUBLISH_START, DOCUMENT_PUBLISH_SUCCESS, DOCUMENT_PUBLISH_ERROR } from './actionTypes'

export const fetchDocument = fetch('FV_DOCUMENT', 'Document', {
  headers: { 'enrichers.document': 'ancestry,permissions,acls' },
})

export const createDocument = create('FV_DOCUMENT', 'Document', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})

export const updateDocument = update(
  'FV_DOCUMENT',
  'Document',
  { headers: { 'enrichers.document': 'ancestry,permissions' } },
  false
)

export const updateAndPublishDocument = update(
  'FV_DOCUMENT',
  'Document',
  { headers: { 'enrichers.document': 'ancestry,permissions', 'fv-publish': true } },
  false
)

export const deleteDocument = _delete('FV_DOCUMENT', 'Document', {})

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

export const fetchResultSet = execute('FV_RESULT_SET', 'Repository.ResultSetQuery')

export const fetchSourceDocument = execute('FV_SOURCE_DOCUMENT', 'Proxy.GetSourceDocument')
