import { create, _delete, execute, fetch, query, update } from 'providers/redux/reducers/rest'
import DirectoryOperations from 'operations/DirectoryOperations'

import {
  FV_LABELS_SHARED_FETCH_START,
  FV_LABELS_SHARED_FETCH_SUCCESS,
  FV_LABELS_SHARED_FETCH_ERROR,
  FV_LABEL_FETCH_ALL_START,
  FV_LABEL_FETCH_ALL_SUCCESS,
  FV_LABEL_FETCH_ALL_ERROR,
  FV_LABELS_USER_MODIFIED_QUERY_START,
  FV_LABELS_USER_MODIFIED_QUERY_SUCCESS,
  FV_LABELS_USER_MODIFIED_QUERY_ERROR,
  FV_LABELS_USER_CREATED_QUERY_START,
  FV_LABELS_USER_CREATED_QUERY_SUCCESS,
  FV_LABELS_USER_CREATED_QUERY_ERROR,
} from './actionTypes'

export const fetchLabel = fetch('FV_LABEL', 'FVLabel', {
  headers: {
    'enrichers.document': 'ancestry,label,permissions',
  },
})

export const fetchLabels = query('FV_LABELS', 'FVLabel', {
  headers: {
    'enrichers.document': 'label',
    properties: 'dublincore, fv-label, fvcore, fvproxy',
  },
})

export const createLabel = create('FV_LABEL', 'FVLabel', {
  headers: { 'enrichers.document': 'ancestry,label,permissions' },
})

export const updateLabel = update(
  'FV_LABEL',
  'FVLabel',
  { headers: { 'enrichers.document': 'ancestry,label,permissions' } },
  false
)

export const deleteLabel = _delete('FV_LABEL', 'FVLabel', {})

export const publishLabel = execute('FV_LABEL_PUBLISH', 'FVPublish', {
  headers: { 'enrichers.document': 'ancestry,label,permissions' },
})

export const askToPublishLabel = execute('FV_LABEL_PUBLISH_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,label,permissions' },
})

export const unpublishLabel = execute('FV_LABEL_UNPUBLISH', 'FVUnpublishDialect', {
  headers: { 'enrichers.document': 'ancestry,label,permissions' },
})

export const askToUnpublishLabel = execute('FV_LABEL_UNPUBLISH_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,label,permissions' },
})

export const enableLabel = execute('FV_LABEL_ENABLE', 'FVEnableDocument', {
  headers: { 'enrichers.document': 'ancestry,label,permissions' },
})

export const askToEnableLabel = execute('FV_LABEL_ENABLE_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,label,permissions' },
})

export const disableLabel = execute('FV_LABEL_DISABLE', 'FVDisableDocument', {
  headers: { 'enrichers.document': 'ancestry,label,permissions' },
})

export const askToDisableLabel = execute('FV_LABEL_DISABLE_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,label,permissions' },
})

export const fetchSharedLabels = (page_provider, headers = {}, params = {}) => {
  return (dispatch) => {
    dispatch({ type: FV_LABELS_SHARED_FETCH_START })

    return DirectoryOperations.getDocumentsViaPageProvider(page_provider, 'FVLabel', headers, params)
      .then((response) => {
        dispatch({ type: FV_LABELS_SHARED_FETCH_SUCCESS, documents: response })
      })
      .catch((error) => {
        dispatch({ type: FV_LABELS_SHARED_FETCH_ERROR, error: error })
      })
  }
}

export const fetchLabelsAll = (path /*, type*/) => {
  return (dispatch) => {
    dispatch({ type: FV_LABEL_FETCH_ALL_START })

    return DirectoryOperations.getDocuments(path, 'FVLabel', '', { headers: { 'enrichers.document': 'ancestry' } })
      .then((response) => {
        dispatch({ type: FV_LABEL_FETCH_ALL_SUCCESS, documents: response })
      })
      .catch((error) => {
        dispatch({ type: FV_LABEL_FETCH_ALL_ERROR, error: error })
      })
  }
}

export const queryModifiedLabels = query('FV_MODIFIED_LABELS', 'FVLabel', {
  queryAppend: '&sortBy=dc:modified&sortOrder=DESC&pageSize=4',
  headers: { properties: 'dublincore' },
})

export const queryCreatedLabels = query('FV_CREATED_LABELS', 'FVLabel', {
  queryAppend: '&sortBy=dc:created&sortOrder=DESC&pageSize=4',
  headers: { properties: 'dublincore' },
})

export const queryUserModifiedLabels = (pathOrId, user) => {
  return (dispatch) => {
    dispatch({ type: FV_LABELS_USER_MODIFIED_QUERY_START })

    return DirectoryOperations.getDocuments(
      pathOrId,
      'FVLabel',
      " AND dc:lastContributor='" + user + "'&sortBy=dc:modified&sortOrder=DESC&pageSize=4",
      { properties: 'dublincore' }
    )
      .then((response) => {
        dispatch({ type: FV_LABELS_USER_MODIFIED_QUERY_SUCCESS, document: response })
      })
      .catch((error) => {
        dispatch({ type: FV_LABELS_USER_MODIFIED_QUERY_ERROR, error: error })
      })
  }
}

export const queryUserCreatedLabels = (pathOrId, user) => {
  return (dispatch) => {
    dispatch({ type: FV_LABELS_USER_CREATED_QUERY_START })

    return DirectoryOperations.getDocuments(
      pathOrId,
      'FVLabel',
      " AND dc:lastContributor='" + user + "'&sortBy=dc:created&sortOrder=DESC&pageSize=4",
      { properties: 'dublincore' }
    )
      .then((response) => {
        dispatch({ type: FV_LABELS_USER_CREATED_QUERY_SUCCESS, document: response })
      })
      .catch((error) => {
        dispatch({ type: FV_LABELS_USER_CREATED_QUERY_ERROR, error: error })
      })
  }
}
