import RESTActions from './rest-actions'
import RESTReducers from './rest-reducers'

// Middleware
import thunk from 'redux-thunk'

// Operations
import DirectoryOperations from 'operations/DirectoryOperations'
import DocumentOperations from 'operations/DocumentOperations'

const DISMISS_ERROR = 'DISMISS_ERROR'

/**
 * Multiple Word Actions
 */
const FV_WORDS_FETCH_START = 'FV_WORDS_FETCH_START'
const FV_WORDS_FETCH_SUCCESS = 'FV_WORDS_FETCH_SUCCESS'
const FV_WORDS_FETCH_ERROR = 'FV_WORDS_FETCH_ERROR'

const FV_WORDS_UPDATE_START = 'FV_WORDS_UPDATE_START'
const FV_WORDS_UPDATE_SUCCESS = 'FV_WORDS_UPDATE_SUCCESS'
const FV_WORDS_UPDATE_ERROR = 'FV_WORDS_UPDATE_ERROR'

const FV_WORDS_CREATE_START = 'FV_WORDS_CREATE_START'
const FV_WORDS_CREATE_SUCCESS = 'FV_WORDS_CREATE_SUCCESS'
const FV_WORDS_CREATE_ERROR = 'FV_WORDS_CREATE_ERROR'

const FV_WORDS_DELETE_START = 'FV_WORDS_DELETE_START'
const FV_WORDS_DELETE_SUCCESS = 'FV_WORDS_DELETE_SUCCESS'
const FV_WORDS_DELETE_ERROR = 'FV_WORDS_DELETE_ERROR'

const FV_WORDS_SHARED_FETCH_START = 'FV_WORDS_SHARED_FETCH_START'
const FV_WORDS_SHARED_FETCH_SUCCESS = 'FV_WORDS_SHARED_FETCH_SUCCESS'
const FV_WORDS_SHARED_FETCH_ERROR = 'FV_WORDS_SHARED_FETCH_ERROR'

/**
 * Single Word Actions
 */
const FV_WORD_FETCH_ALL_START = 'FV_WORD_FETCH_ALL_START'
const FV_WORD_FETCH_ALL_SUCCESS = 'FV_WORD_FETCH_ALL_SUCCESS'
const FV_WORD_FETCH_ALL_ERROR = 'FV_WORD_FETCH_ALL_ERROR'

const FV_WORDS_USER_MODIFIED_QUERY_START = 'FV_WORDS_USER_MODIFIED_QUERY_START'
const FV_WORDS_USER_MODIFIED_QUERY_SUCCESS = 'FV_WORDS_USER_MODIFIED_QUERY_SUCCESS'
const FV_WORDS_USER_MODIFIED_QUERY_ERROR = 'FV_WORDS_USER_MODIFIED_QUERY_ERROR'

const FV_WORDS_USER_CREATED_QUERY_START = 'FV_WORDS_USER_CREATED_QUERY_START'
const FV_WORDS_USER_CREATED_QUERY_SUCCESS = 'FV_WORDS_USER_CREATED_QUERY_SUCCESS'
const FV_WORDS_USER_CREATED_QUERY_ERROR = 'FV_WORDS_USER_CREATED_QUERY_ERROR'

const fetchWord = RESTActions.fetch('FV_WORD', 'FVWord', {
  headers: { 'X-NXenrichers.document': 'ancestry,word,permissions' },
})
const fetchWords = RESTActions.query('FV_WORDS', 'FVWord', {
  headers: {
    'X-NXenrichers.document': 'word',
    'X-NXproperties': 'dublincore, fv-word, fvcore, fvproxy',
  },
})
const createWord = RESTActions.create('FV_WORD', 'FVWord', {
  headers: { 'X-NXenrichers.document': 'ancestry,word,permissions' },
})
const updateWord = RESTActions.update(
  'FV_WORD',
  'FVWord',
  { headers: { 'X-NXenrichers.document': 'ancestry,word,permissions' } },
  false
)
const deleteWord = RESTActions.delete('FV_WORD', 'FVWord', {})

const publishWord = RESTActions.execute('FV_WORD_PUBLISH', 'FVPublish', {
  headers: { 'X-NXenrichers.document': 'ancestry,word,permissions' },
})
const askToPublishWord = RESTActions.execute('FV_WORD_PUBLISH_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'X-NXenrichers.document': 'ancestry,word,permissions' },
})
const unpublishWord = RESTActions.execute('FV_WORD_UNPUBLISH', 'FVUnpublishDialect', {
  headers: { 'X-NXenrichers.document': 'ancestry,word,permissions' },
})
const askToUnpublishWord = RESTActions.execute('FV_WORD_UNPUBLISH_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'X-NXenrichers.document': 'ancestry,word,permissions' },
})
const enableWord = RESTActions.execute('FV_WORD_ENABLE', 'FVEnableDocument', {
  headers: { 'X-NXenrichers.document': 'ancestry,word,permissions' },
})
const askToEnableWord = RESTActions.execute('FV_WORD_ENABLE_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'X-NXenrichers.document': 'ancestry,word,permissions' },
})
const disableWord = RESTActions.execute('FV_WORD_DISABLE', 'FVDisableDocument', {
  headers: { 'X-NXenrichers.document': 'ancestry,word,permissions' },
})
const askToDisableWord = RESTActions.execute('FV_WORD_DISABLE_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'X-NXenrichers.document': 'ancestry,word,permissions' },
})

const computeWordFetchFactory = RESTReducers.computeFetch('word')
const computeWordDeleteFactory = RESTReducers.computeDelete('delete_word')
const computeWordEnableOperationFactory = RESTReducers.computeOperation('word_enable_workflow')
const computeWordDisableOperationFactory = RESTReducers.computeOperation('word_disable_workflow')

const computeWordsQueryFactory = RESTReducers.computeQuery('words')

const fetchSharedWords = (page_provider, headers = {}, params = {}) => {
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

const fetchWordsAll = (path, type) => {
  return (dispatch) => {
    dispatch({ type: FV_WORD_FETCH_ALL_START })

    return DirectoryOperations.getDocuments(path, 'FVWord', '', { headers: { 'X-NXenrichers.document': 'ancestry' } })
      .then((response) => {
        dispatch({ type: FV_WORD_FETCH_ALL_SUCCESS, documents: response })
      })
      .catch((error) => {
        dispatch({ type: FV_WORD_FETCH_ALL_ERROR, error: error })
      })
  }
}

const queryModifiedWords = RESTActions.query('FV_MODIFIED_WORDS', 'FVWord', {
  queryAppend: '&sortBy=dc:modified&sortOrder=DESC&pageSize=4',
  headers: { 'X-NXProperties': 'dublincore' },
})
const computeRecentlyModifiedWordsQuery = RESTReducers.computeQuery('modified_words')

const queryCreatedWords = RESTActions.query('FV_CREATED_WORDS', 'FVWord', {
  queryAppend: '&sortBy=dc:created&sortOrder=DESC&pageSize=4',
  headers: { 'X-NXProperties': 'dublincore' },
})
const computeRecentlyCreatedWordsQuery = RESTReducers.computeQuery('created_words')

const queryUserModifiedWords = (pathOrId, user) => {
  return (dispatch) => {
    dispatch({ type: FV_WORDS_USER_MODIFIED_QUERY_START })

    return DirectoryOperations.getDocuments(
      pathOrId,
      'FVWord',
      " AND dc:lastContributor='" + user + "'&sortBy=dc:modified&sortOrder=DESC&pageSize=4",
      { 'X-NXProperties': 'dublincore' }
    )
      .then((response) => {
        dispatch({ type: FV_WORDS_USER_MODIFIED_QUERY_SUCCESS, document: response })
      })
      .catch((error) => {
        dispatch({ type: FV_WORDS_USER_MODIFIED_QUERY_ERROR, error: error })
      })
  }
}

const queryUserCreatedWords = (pathOrId, user) => {
  return (dispatch) => {
    dispatch({ type: FV_WORDS_USER_CREATED_QUERY_START })

    return DirectoryOperations.getDocuments(
      pathOrId,
      'FVWord',
      " AND dc:lastContributor='" + user + "'&sortBy=dc:created&sortOrder=DESC&pageSize=4",
      { 'X-NXProperties': 'dublincore' }
    )
      .then((response) => {
        dispatch({ type: FV_WORDS_USER_CREATED_QUERY_SUCCESS, document: response })
      })
      .catch((error) => {
        dispatch({ type: FV_WORDS_USER_CREATED_QUERY_ERROR, error: error })
      })
  }
}

const actions = {
  fetchSharedWords,
  fetchWord,
  fetchWords,
  createWord,
  deleteWord,
  fetchWordsAll,
  updateWord,
  publishWord,
  askToPublishWord,
  unpublishWord,
  askToUnpublishWord,
  enableWord,
  askToEnableWord,
  disableWord,
  askToDisableWord,
  queryModifiedWords,
  queryCreatedWords,
  queryUserModifiedWords,
  queryUserCreatedWords,
}

const reducers = {
  computeSharedWords(
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
      case FV_WORDS_SHARED_FETCH_START:
        return Object.assign({}, state, { isFetching: true })
        break

      // Send modified document to UI without access REST end-point
      case FV_WORDS_SHARED_FETCH_SUCCESS:
        return Object.assign({}, state, { response: action.documents, isFetching: false, success: true })
        break

      // Send modified document to UI without access REST end-point
      case FV_WORDS_SHARED_FETCH_ERROR:
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
  computeWord: computeWordFetchFactory.computeWord,
  computeWords: computeWordsQueryFactory.computeWords,
  computeDeleteWord: computeWordDeleteFactory.computeDeleteWord,
  computeWordEnableWorkflow: computeWordEnableOperationFactory.computeWordEnableWorkflow,
  computeWordDisableWorkflow: computeWordDisableOperationFactory.computeWordDisableWorkflow,
  computeWordsAll(
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
      case FV_WORD_FETCH_ALL_START:
        return Object.assign({}, state, { isFetching: true, success: false })
        break

      case FV_WORD_FETCH_ALL_SUCCESS:
        return Object.assign({}, state, { response: action.documents, isFetching: false, success: true })
        break

      case FV_WORD_FETCH_ALL_ERROR:
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

  computeModifiedWords: computeRecentlyModifiedWordsQuery.computeModifiedWords,
  computeCreatedWords: computeRecentlyCreatedWordsQuery.computeCreatedWords,
  computeUserModifiedWords(
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
      case FV_WORDS_USER_MODIFIED_QUERY_START:
        return Object.assign({}, state, { isFetching: true })
        break

      // Send modified document to UI without access REST end-point
      case FV_WORDS_USER_MODIFIED_QUERY_SUCCESS:
        return Object.assign({}, state, { response: action.document, isFetching: false, success: true })
        break

      // Send modified document to UI without access REST end-point
      case FV_WORDS_USER_MODIFIED_QUERY_ERROR:
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
  computeUserCreatedWords(
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
      case FV_WORDS_USER_CREATED_QUERY_START:
        return Object.assign({}, state, { isFetching: true })
        break

      // Send modified document to UI without access REST end-point
      case FV_WORDS_USER_CREATED_QUERY_SUCCESS:
        return Object.assign({}, state, { response: action.document, isFetching: false, success: true })
        break

      // Send modified document to UI without access REST end-point
      case FV_WORDS_USER_CREATED_QUERY_ERROR:
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
}

const middleware = [thunk]

export default { actions, reducers, middleware }
