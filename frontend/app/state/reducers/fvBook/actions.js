import { fetch, execute, query, create, update, _delete } from 'reducers/rest'
import DirectoryOperations from 'operations/DirectoryOperations'

import {
  FV_BOOKS_SHARED_FETCH_START,
  FV_BOOKS_SHARED_FETCH_SUCCESS,
  FV_BOOKS_SHARED_FETCH_ERROR,
  FV_BOOK_FETCH_ALL_START,
  FV_BOOK_FETCH_ALL_SUCCESS,
  FV_BOOK_FETCH_ALL_ERROR,
  FV_STORIES_USER_MODIFIED_QUERY_START,
  FV_STORIES_USER_MODIFIED_QUERY_SUCCESS,
  FV_STORIES_USER_MODIFIED_QUERY_ERROR,
  FV_STORIES_USER_CREATED_QUERY_START,
  FV_STORIES_USER_CREATED_QUERY_SUCCESS,
  FV_STORIES_USER_CREATED_QUERY_ERROR,
  FV_SONGS_USER_MODIFIED_QUERY_START,
  FV_SONGS_USER_MODIFIED_QUERY_SUCCESS,
  FV_SONGS_USER_MODIFIED_QUERY_ERROR,
  FV_SONGS_USER_CREATED_QUERY_START,
  FV_SONGS_USER_CREATED_QUERY_SUCCESS,
  FV_SONGS_USER_CREATED_QUERY_ERROR,
} from './actionTypes'

export const fetchSharedBooks = (page_provider, headers = {}, params = {}) => {
  return (dispatch) => {
    dispatch({ type: FV_BOOKS_SHARED_FETCH_START })

    return DirectoryOperations.getDocumentsViaPageProvider(page_provider, 'FVBook', headers, params)
      .then((response) => {
        dispatch({ type: FV_BOOKS_SHARED_FETCH_SUCCESS, documents: response })
      })
      .catch((error) => {
        dispatch({ type: FV_BOOKS_SHARED_FETCH_ERROR, error: error })
      })
  }
}

export const fetchBooksAll = (path /*, type*/) => {
  return (dispatch) => {
    dispatch({ type: FV_BOOK_FETCH_ALL_START })

    return DirectoryOperations.getDocuments(path, 'FVBook', '', {
      headers: { 'enrichers.document': 'ancestry,permissions,book' },
    })
      .then((response) => {
        dispatch({ type: FV_BOOK_FETCH_ALL_SUCCESS, documents: response })
      })
      .catch((error) => {
        dispatch({ type: FV_BOOK_FETCH_ALL_ERROR, error: error })
      })
  }
}

export const fetchBook = fetch('FV_BOOK', 'FVBook', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const fetchBooks = query('FV_BOOKS', 'FVBook', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const createBook = create('FV_BOOK', 'FVBook', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const updateBook = update(
  'FV_BOOK',
  'FVBook',
  { headers: { 'enrichers.document': 'ancestry,permissions,book' } },
  false
)
export const deleteBook = _delete('FV_BOOK', 'FVBook', {})

// Document.FollowLifecycleTransition expects a param that specifies the type of transition to take place e.g. { value: 'Republish' }
export const publishBook = execute('FV_BOOK_PUBLISH', 'Document.FollowLifecycleTransition', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const unpublishBook = execute('FV_BOOK_UNPUBLISH', 'FVUnpublishDialect', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const enableBook = execute('FV_BOOK_ENABLE', 'FVEnableDocument', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const disableBook = execute('FV_BOOK_DISABLE', 'FVDisableDocument', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const fetchBookEntry = fetch('FV_BOOK_ENTRY', 'FVBookEntry', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const createBookEntry = create('FV_BOOK_ENTRY', 'FVBookEntry', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const updateBookEntry = update('FV_BOOK_ENTRY', 'FVBookEntry', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const deleteBookEntry = _delete('FV_BOOK_ENTRY', 'FVBookEntry', {})

// Document.FollowLifecycleTransition expects a param that specifies the type of transition to take place e.g. { value: 'Republish' }
export const publishBookEntry = execute('FV_BOOK_ENTRY_PUBLISH', 'Document.FollowLifecycleTransition', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const unpublishBookEntry = execute('FV_BOOK_ENTRY_UNPUBLISH', 'FVUnpublishDialect', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const enableBookEntry = execute('FV_BOOK_ENTRY_ENABLE', 'FVEnableDocument', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const disableBookEntry = execute('FV_BOOK_ENTRY_DISABLE', 'FVDisableDocument', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const fetchBookEntries = query('FV_BOOK_ENTRIES', 'FVBookEntry', {
  headers: { 'enrichers.document': 'ancestry,book,permissions' },
})

export const queryModifiedStories = query('FV_MODIFIED_STORIES', 'FVBook', {
  queryAppend: " AND fvbook:type='story'&sortBy=dc:modified&sortOrder=DESC&pageSize=4",
  headers: { properties: 'dublincore' },
})

export const queryCreatedStories = query('FV_CREATED_STORIES', 'FVBook', {
  queryAppend: " AND fvbook:type='story'&sortBy=dc:created&sortOrder=DESC&pageSize=4",
  headers: { properties: 'dublincore' },
})

export const queryModifiedSongs = query('FV_MODIFIED_SONGS', 'FVBook', {
  queryAppend: " AND fvbook:type='song'&sortBy=dc:modified&sortOrder=DESC&pageSize=4",
  headers: { properties: 'dublincore' },
})

export const queryCreatedSongs = query('FV_CREATED_SONGS', 'FVBook', {
  queryAppend: " AND fvbook:type='song'&sortBy=dc:created&sortOrder=DESC&pageSize=4",
  headers: { properties: 'dublincore' },
})

export const queryUserModifiedStories = (pathOrId, user) => {
  return (dispatch) => {
    dispatch({ type: FV_STORIES_USER_MODIFIED_QUERY_START })

    return DirectoryOperations.getDocuments(
      pathOrId,
      'FVBook',
      " AND fvbook:type='story' AND dc:lastContributor='" + user + "'&sortBy=dc:modified&sortOrder=DESC&pageSize=4",
      { properties: 'dublincore' }
    )
      .then((response) => {
        dispatch({ type: FV_STORIES_USER_MODIFIED_QUERY_SUCCESS, document: response })
      })
      .catch((error) => {
        dispatch({ type: FV_STORIES_USER_MODIFIED_QUERY_ERROR, error: error })
      })
  }
}

export const queryUserCreatedStories = (pathOrId, user) => {
  return (dispatch) => {
    dispatch({ type: FV_STORIES_USER_CREATED_QUERY_START })

    return DirectoryOperations.getDocuments(
      pathOrId,
      'FVBook',
      " AND fvbook:type='story' AND dc:lastContributor='" + user + "'&sortBy=dc:created&sortOrder=DESC&pageSize=4",
      { properties: 'dublincore' }
    )
      .then((response) => {
        dispatch({ type: FV_STORIES_USER_CREATED_QUERY_SUCCESS, document: response })
      })
      .catch((error) => {
        dispatch({ type: FV_STORIES_USER_CREATED_QUERY_ERROR, error: error })
      })
  }
}

export const queryUserModifiedSongs = (pathOrId, user) => {
  return (dispatch) => {
    dispatch({ type: FV_SONGS_USER_MODIFIED_QUERY_START })

    return DirectoryOperations.getDocuments(
      pathOrId,
      'FVBook',
      " AND fvbook:type='song' AND dc:lastContributor='" + user + "'&sortBy=dc:modified&sortOrder=DESC&pageSize=4",
      { properties: 'dublincore' }
    )
      .then((response) => {
        dispatch({ type: FV_SONGS_USER_MODIFIED_QUERY_SUCCESS, document: response })
      })
      .catch((error) => {
        dispatch({ type: FV_SONGS_USER_MODIFIED_QUERY_ERROR, error: error })
      })
  }
}

export const queryUserCreatedSongs = (pathOrId, user) => {
  return (dispatch) => {
    dispatch({ type: FV_SONGS_USER_CREATED_QUERY_START })

    return DirectoryOperations.getDocuments(
      pathOrId,
      'FVBook',
      " AND fvbook:type='song' AND dc:lastContributor='" + user + "'&sortBy=dc:created&sortOrder=DESC&pageSize=4",
      { properties: 'dublincore' }
    )
      .then((response) => {
        dispatch({ type: FV_SONGS_USER_CREATED_QUERY_SUCCESS, document: response })
      })
      .catch((error) => {
        dispatch({ type: FV_SONGS_USER_CREATED_QUERY_ERROR, error: error })
      })
  }
}
