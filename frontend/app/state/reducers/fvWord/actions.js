import { create, _delete, execute, fetch, query } from 'reducers/rest'
import DirectoryOperations from 'operations/DirectoryOperations'

import {
  FV_WORDS_SHARED_FETCH_START,
  FV_WORDS_SHARED_FETCH_SUCCESS,
  FV_WORDS_SHARED_FETCH_ERROR,
  FV_WORD_FETCH_ALL_START,
  FV_WORD_FETCH_ALL_SUCCESS,
  FV_WORD_FETCH_ALL_ERROR,
  FV_WORDS_USER_MODIFIED_QUERY_START,
  FV_WORDS_USER_MODIFIED_QUERY_SUCCESS,
  FV_WORDS_USER_MODIFIED_QUERY_ERROR,
  FV_WORDS_USER_CREATED_QUERY_START,
  FV_WORDS_USER_CREATED_QUERY_SUCCESS,
  FV_WORDS_USER_CREATED_QUERY_ERROR,
} from './actionTypes'

export const fetchWord = fetch('FV_WORD', 'FVWord', {
  headers: {
    'enrichers.document': 'ancestry,word,permissions,unpublished_changes',
    properties: '*',
  },
})

export const fetchWords = query('FV_WORDS', 'FVWord', {
  headers: {
    'enrichers.document': 'word',
    properties: 'dublincore, fv-word, fvcore, fvproxy',
  },
})

export const createWord = create('FV_WORD', 'FVWord', {})

export const createAndPublishWord = create('FV_WORD', 'FVWord', {
  headers: { 'fv-publish': true },
})

export const deleteWord = _delete('FV_WORD', 'FVWord', {})

// Document.FollowLifecycleTransition expects a param that specifies the type of transition to take place e.g. { value: 'Republish' }
export const publishWord = execute('FV_WORD_PUBLISH', 'Document.FollowLifecycleTransition', {
  headers: { 'enrichers.document': 'ancestry,word,permissions' },
})
export const fetchSharedWords = (page_provider, headers = {}, params = {}) => {
  return (dispatch) => {
    dispatch({ type: FV_WORDS_SHARED_FETCH_START })

    return DirectoryOperations.getDocumentsViaPageProvider(page_provider, 'FVWord', headers, params)
      .then((response) => {
        dispatch({ type: FV_WORDS_SHARED_FETCH_SUCCESS, documents: response })
      })
      .catch((error) => {
        dispatch({ type: FV_WORDS_SHARED_FETCH_ERROR, error: error })
      })
  }
}

export const fetchWordsAll = (path /*, type*/) => {
  return (dispatch) => {
    dispatch({ type: FV_WORD_FETCH_ALL_START })

    return DirectoryOperations.getDocuments(path, 'FVWord', '', { headers: { 'enrichers.document': 'ancestry' } })
      .then((response) => {
        dispatch({ type: FV_WORD_FETCH_ALL_SUCCESS, documents: response })
      })
      .catch((error) => {
        dispatch({ type: FV_WORD_FETCH_ALL_ERROR, error: error })
      })
  }
}

export const queryModifiedWords = query('FV_MODIFIED_WORDS', 'FVWord', {
  queryAppend: '&sortBy=dc:modified&sortOrder=DESC&pageSize=4',
  headers: { properties: 'dublincore' },
})

export const queryCreatedWords = query('FV_CREATED_WORDS', 'FVWord', {
  queryAppend: '&sortBy=dc:created&sortOrder=DESC&pageSize=4',
  headers: { properties: 'dublincore' },
})

export const queryUserModifiedWords = (pathOrId, user) => {
  return (dispatch) => {
    dispatch({ type: FV_WORDS_USER_MODIFIED_QUERY_START })

    return DirectoryOperations.getDocuments(
      pathOrId,
      'FVWord',
      " AND dc:lastContributor='" + user + "'&sortBy=dc:modified&sortOrder=DESC&pageSize=4",
      { properties: 'dublincore' }
    )
      .then((response) => {
        dispatch({ type: FV_WORDS_USER_MODIFIED_QUERY_SUCCESS, document: response })
      })
      .catch((error) => {
        dispatch({ type: FV_WORDS_USER_MODIFIED_QUERY_ERROR, error: error })
      })
  }
}

export const queryUserCreatedWords = (pathOrId, user) => {
  return (dispatch) => {
    dispatch({ type: FV_WORDS_USER_CREATED_QUERY_START })

    return DirectoryOperations.getDocuments(
      pathOrId,
      'FVWord',
      " AND dc:lastContributor='" + user + "'&sortBy=dc:created&sortOrder=DESC&pageSize=4",
      { properties: 'dublincore' }
    )
      .then((response) => {
        dispatch({ type: FV_WORDS_USER_CREATED_QUERY_SUCCESS, document: response })
      })
      .catch((error) => {
        dispatch({ type: FV_WORDS_USER_CREATED_QUERY_ERROR, error: error })
      })
  }
}
