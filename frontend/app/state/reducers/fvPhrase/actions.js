import { create, _delete, execute, fetch, query, update } from 'reducers/rest'
import DirectoryOperations from 'operations/DirectoryOperations'
import {
  FV_PHRASES_SHARED_FETCH_START,
  FV_PHRASES_SHARED_FETCH_SUCCESS,
  FV_PHRASES_SHARED_FETCH_ERROR,
  FV_PHRASE_FETCH_ALL_START,
  FV_PHRASE_FETCH_ALL_SUCCESS,
  FV_PHRASE_FETCH_ALL_ERROR,
  FV_PHRASES_USER_MODIFIED_QUERY_START,
  FV_PHRASES_USER_MODIFIED_QUERY_SUCCESS,
  FV_PHRASES_USER_MODIFIED_QUERY_ERROR,
  FV_PHRASES_USER_CREATED_QUERY_START,
  FV_PHRASES_USER_CREATED_QUERY_SUCCESS,
  FV_PHRASES_USER_CREATED_QUERY_ERROR,
} from './actionTypes'

export const fetchSharedPhrases = function fetchSharedPhrases(pageProvider, headers = {}, params = {}) {
  return (dispatch) => {
    dispatch({ type: FV_PHRASES_SHARED_FETCH_START })

    return DirectoryOperations.getDocumentsViaPageProvider(pageProvider, 'FVPhrase', headers, params)
      .then((response) => {
        dispatch({ type: FV_PHRASES_SHARED_FETCH_SUCCESS, documents: response })
      })
      .catch((error) => {
        dispatch({ type: FV_PHRASES_SHARED_FETCH_ERROR, error: error })
      })
  }
}

export const fetchPhrasesAll = function fetchPhrasesAll(path /*, type*/) {
  return (dispatch) => {
    dispatch({ type: FV_PHRASE_FETCH_ALL_START })

    return DirectoryOperations.getDocuments(path, 'FVPhrase', '', {
      headers: { 'enrichers.document': 'ancestry,phrase,permissions' },
    })
      .then((response) => {
        dispatch({ type: FV_PHRASE_FETCH_ALL_SUCCESS, documents: response })
      })
      .catch((error) => {
        dispatch({ type: FV_PHRASE_FETCH_ALL_ERROR, error: error })
      })
  }
}

export const fetchPhrase = fetch('FV_PHRASE', 'FVPhrase', {
  headers: { 'enrichers.document': 'ancestry,phrase,permissions' },
})

export const fetchPhrases = query('FV_PHRASES', 'FVPhrase', { headers: { 'enrichers.document': 'phrase' } })

export const createPhrase = create('FV_PHRASE', 'FVPhrase', {
  headers: { 'enrichers.document': 'ancestry,phrase,permissions' },
})

export const updatePhrase = update(
  'FV_PHRASE',
  'FVPhrase',
  { headers: { 'enrichers.document': 'ancestry,phrase,permissions' } },
  false
)

export const deletePhrase = _delete('FV_PHRASE', 'FVPhrase', {})

// Document.FollowLifecycleTransition expects a param that specifies the type of transition to take place e.g. { value: 'Republish' }
export const publishPhrase = execute('FV_PHRASE_PUBLISH', 'Document.FollowLifecycleTransition', {
  headers: { 'enrichers.document': 'ancestry,phrase,permissions' },
})

export const unpublishPhrase = execute('FV_PHRASE_UNPUBLISH', 'FVUnpublishDialect', {
  headers: { 'enrichers.document': 'ancestry,phrase,permissions' },
})

export const enablePhrase = execute('FV_PHRASE_ENABLE', 'FVEnableDocument', {
  headers: { 'enrichers.document': 'ancestry,phrase,permissions' },
})

export const disablePhrase = execute('FV_PHRASE_DISABLE', 'FVDisableDocument', {
  headers: { 'enrichers.document': 'ancestry,phrase,permissions' },
})

export const queryModifiedPhrases = query('FV_MODIFIED_PHRASES', 'FVPhrase', {
  queryAppend: '&sortBy=dc:modified&sortOrder=DESC&pageSize=4',
  headers: { properties: 'dublincore' },
})

export const queryCreatedPhrases = query('FV_CREATED_PHRASES', 'FVPhrase', {
  queryAppend: '&sortBy=dc:created&sortOrder=DESC&pageSize=4',
  headers: { properties: 'dublincore' },
})

export const queryUserModifiedPhrases = function queryUserModifiedPhrases(pathOrId, user) {
  return (dispatch) => {
    dispatch({ type: FV_PHRASES_USER_MODIFIED_QUERY_START })

    return DirectoryOperations.getDocuments(
      pathOrId,
      'FVPhrase',
      " AND dc:lastContributor='" + user + "'&sortBy=dc:modified&sortOrder=DESC&pageSize=4",
      { properties: 'dublincore' }
    )
      .then((response) => {
        dispatch({ type: FV_PHRASES_USER_MODIFIED_QUERY_SUCCESS, document: response })
      })
      .catch((error) => {
        dispatch({ type: FV_PHRASES_USER_MODIFIED_QUERY_ERROR, error: error })
      })
  }
}

export const queryUserCreatedPhrases = function queryUserCreatedPhrases(pathOrId, user) {
  return (dispatch) => {
    dispatch({ type: FV_PHRASES_USER_CREATED_QUERY_START })

    return DirectoryOperations.getDocuments(
      pathOrId,
      'FVPhrase',
      " AND dc:lastContributor='" + user + "'&sortBy=dc:created&sortOrder=DESC&pageSize=4",
      { properties: 'dublincore' }
    )
      .then((response) => {
        dispatch({ type: FV_PHRASES_USER_CREATED_QUERY_SUCCESS, document: response })
      })
      .catch((error) => {
        dispatch({ type: FV_PHRASES_USER_CREATED_QUERY_ERROR, error: error })
      })
  }
}
