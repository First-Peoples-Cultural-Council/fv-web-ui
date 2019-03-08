import RESTActions from './rest-actions'
import RESTReducers from './rest-reducers'

// Middleware
import thunk from 'redux-thunk';

// Operations
import DirectoryOperations from 'operations/DirectoryOperations';
import DocumentOperations from 'operations/DocumentOperations';

const DISMISS_ERROR = 'DISMISS_ERROR';


/**
 * Multiple Book Actions
 */
const FV_BOOKS_FETCH_START = "FV_BOOKS_FETCH_START";
const FV_BOOKS_FETCH_SUCCESS = "FV_BOOKS_FETCH_SUCCESS";
const FV_BOOKS_FETCH_ERROR = "FV_BOOKS_FETCH_ERROR";

const FV_BOOK_ENTRIES_FETCH_START = "FV_BOOK_ENTRIES_FETCH_START";
const FV_BOOK_ENTRIES_FETCH_SUCCESS = "FV_BOOKS_ENTRIES_FETCH_SUCCESS";
const FV_BOOK_ENTRIES_FETCH_ERROR = "FV_BOOKS_ENTRIES_FETCH_ERROR";

const FV_BOOKS_UPDATE_START = "FV_BOOKS_UPDATE_START";
const FV_BOOKS_UPDATE_SUCCESS = "FV_BOOKS_UPDATE_SUCCESS";
const FV_BOOKS_UPDATE_ERROR = "FV_BOOKS_UPDATE_ERROR";

const FV_BOOKS_CREATE_START = "FV_BOOKS_CREATE_START";
const FV_BOOKS_CREATE_SUCCESS = "FV_BOOKS_CREATE_SUCCESS";
const FV_BOOKS_CREATE_ERROR = "FV_BOOKS_CREATE_ERROR";

const FV_BOOKS_DELETE_START = "FV_BOOKS_DELETE_START";
const FV_BOOKS_DELETE_SUCCESS = "FV_BOOKS_DELETE_SUCCESS";
const FV_BOOKS_DELETE_ERROR = "FV_BOOKS_DELETE_ERROR";

const FV_BOOKS_SHARED_FETCH_START = "FV_BOOKS_SHARED_FETCH_START";
const FV_BOOKS_SHARED_FETCH_SUCCESS = "FV_BOOKS_SHARED_FETCH_SUCCESS";
const FV_BOOKS_SHARED_FETCH_ERROR = "FV_BOOKS_SHARED_FETCH_ERROR";

/**
 * Single Book Actions
 */
const FV_BOOK_FETCH_ALL_START = "FV_BOOK_FETCH_ALL_START";
const FV_BOOK_FETCH_ALL_SUCCESS = "FV_BOOK_FETCH_ALL_SUCCESS";
const FV_BOOK_FETCH_ALL_ERROR = "FV_BOOK_FETCH_ALL_ERROR";

const FV_BOOK_UPDATE_START = "FV_BOOK_UPDATE_START";
const FV_BOOK_UPDATE_SUCCESS = "FV_BOOK_UPDATE_SUCCESS";
const FV_BOOK_UPDATE_ERROR = "FV_BOOK_UPDATE_ERROR";

const FV_STORIES_USER_MODIFIED_QUERY_START = "FV_STORIES_USER_MODIFIED_QUERY_START";
const FV_STORIES_USER_MODIFIED_QUERY_SUCCESS = "FV_STORIES_USER_MODIFIED_QUERY_SUCCESS";
const FV_STORIES_USER_MODIFIED_QUERY_ERROR = "FV_STORIES_USER_MODIFIED_QUERY_ERROR";

const FV_STORIES_USER_CREATED_QUERY_START = "FV_STORIES_USER_CREATED_QUERY_START";
const FV_STORIES_USER_CREATED_QUERY_SUCCESS = "FV_STORIES_USER_CREATED_QUERY_SUCCESS";
const FV_STORIES_USER_CREATED_QUERY_ERROR = "FV_STORIES_USER_CREATED_QUERY_ERROR";

const FV_SONGS_USER_MODIFIED_QUERY_START = "FV_SONGS_USER_MODIFIED_QUERY_START";
const FV_SONGS_USER_MODIFIED_QUERY_SUCCESS = "FV_SONGS_USER_MODIFIED_QUERY_SUCCESS";
const FV_SONGS_USER_MODIFIED_QUERY_ERROR = "FV_SONGS_USER_MODIFIED_QUERY_ERROR";

const FV_SONGS_USER_CREATED_QUERY_START = "FV_SONGS_USER_CREATED_QUERY_START";
const FV_SONGS_USER_CREATED_QUERY_SUCCESS = "FV_SONGS_USER_CREATED_QUERY_SUCCESS";
const FV_SONGS_USER_CREATED_QUERY_ERROR = "FV_SONGS_USER_CREATED_QUERY_ERROR";

const fetchSharedBooks = function fetchSharedBooks(page_provider, headers = {}, params = {}) {
    return function (dispatch) {

        dispatch({type: FV_BOOKS_SHARED_FETCH_START});

        return DirectoryOperations.getDocumentsViaPageProvider(page_provider, 'FVBook', headers, params)
            .then((response) => {
                dispatch({type: FV_BOOKS_SHARED_FETCH_SUCCESS, documents: response})
            }).catch((error) => {
                dispatch({type: FV_BOOKS_SHARED_FETCH_ERROR, error: error})
            });
    }
};

const fetchBooksAll = function fetchBooksAll(path, type) {
    return function (dispatch) {

        dispatch({type: FV_BOOK_FETCH_ALL_START});

        return DirectoryOperations.getDocuments(path, 'FVBook', '', {headers: {'X-NXenrichers.document': 'ancestry,permissions,book'}})
            .then((response) => {
                dispatch({type: FV_BOOK_FETCH_ALL_SUCCESS, documents: response})
            }).catch((error) => {
                dispatch({type: FV_BOOK_FETCH_ALL_ERROR, error: error})
            });
    }
};

const fetchBook = RESTActions.fetch('FV_BOOK', 'FVBook', {headers: {'X-NXenrichers.document': 'ancestry,permissions,book'}});
const fetchBooks = RESTActions.query('FV_BOOKS', 'FVBook', {headers: {'X-NXenrichers.document': 'ancestry,permissions,book'}});
const createBook = RESTActions.create('FV_BOOK', 'FVBook', {headers: {'X-NXenrichers.document': 'ancestry,permissions,book'}});
const updateBook = RESTActions.update('FV_BOOK', 'FVBook', {headers: {'X-NXenrichers.document': 'ancestry,permissions,book'}}, false);
const deleteBook = RESTActions.delete('FV_BOOK', 'FVBook', {});

const publishBook = RESTActions.execute('FV_BOOK_PUBLISH', 'FVPublish', {headers: {'X-NXenrichers.document': 'ancestry,permissions,book'}});
const askToPublishBook = RESTActions.execute('FV_BOOK_PUBLISH_WORKFLOW', 'Context.StartWorkflow', {headers: {'X-NXenrichers.document': 'ancestry,permissions,book'}});
const unpublishBook = RESTActions.execute('FV_BOOK_UNPUBLISH', 'FVUnpublishDialect', {headers: {'X-NXenrichers.document': 'ancestry,permissions,book'}});
const askToUnpublishBook = RESTActions.execute('FV_BOOK_UNPUBLISH_WORKFLOW', 'Context.StartWorkflow', {headers: {'X-NXenrichers.document': 'ancestry,permissions,book'}});
const enableBook = RESTActions.execute('FV_BOOK_ENABLE', 'FVEnableDocument', {headers: {'X-NXenrichers.document': 'ancestry,permissions,book'}});
const askToEnableBook = RESTActions.execute('FV_BOOK_ENABLE_WORKFLOW', 'Context.StartWorkflow', {headers: {'X-NXenrichers.document': 'ancestry,permissions,book'}});
const disableBook = RESTActions.execute('FV_BOOK_DISABLE', 'FVDisableDocument', {headers: {'X-NXenrichers.document': 'ancestry,permissions,book'}});
const askToDisableBook = RESTActions.execute('FV_BOOK_DISABLE_WORKFLOW', 'Context.StartWorkflow', {headers: {'X-NXenrichers.document': 'ancestry,permissions,book'}});

const fetchBookEntry = RESTActions.fetch('FV_BOOK_ENTRY', 'FVBookEntry', {headers: {'X-NXenrichers.document': 'ancestry,permissions,book'}});
const createBookEntry = RESTActions.create('FV_BOOK_ENTRY', 'FVBookEntry', {headers: {'X-NXenrichers.document': 'ancestry,permissions,book'}});
const updateBookEntry = RESTActions.update('FV_BOOK_ENTRY', 'FVBookEntry', {headers: {'X-NXenrichers.document': 'ancestry,permissions,book'}});
const deleteBookEntry = RESTActions.delete('FV_BOOK_ENTRY', 'FVBookEntry', {});

const publishBookEntry = RESTActions.execute('FV_BOOK_ENTRY_PUBLISH', 'FVPublish', {headers: {'X-NXenrichers.document': 'ancestry,permissions,book'}});
const askToPublishBookEntry = RESTActions.execute('FV_BOOK_ENTRY_PUBLISH_WORKFLOW', 'Context.StartWorkflow', {headers: {'X-NXenrichers.document': 'ancestry,permissions,book'}});
const unpublishBookEntry = RESTActions.execute('FV_BOOK_ENTRY_UNPUBLISH', 'FVUnpublishDialect', {headers: {'X-NXenrichers.document': 'ancestry,permissions,book'}});
const askToUnpublishBookEntry = RESTActions.execute('FV_BOOK_ENTRY_UNPUBLISH_WORKFLOW', 'Context.StartWorkflow', {headers: {'X-NXenrichers.document': 'ancestry,permissions,book'}});
const enableBookEntry = RESTActions.execute('FV_BOOK_ENTRY_ENABLE', 'FVEnableDocument', {headers: {'X-NXenrichers.document': 'ancestry,permissions,book'}});
const askToEnableBookEntry = RESTActions.execute('FV_BOOK_ENTRY_ENABLE_WORKFLOW', 'Context.StartWorkflow', {headers: {'X-NXenrichers.document': 'ancestry,permissions,book'}});
const disableBookEntry = RESTActions.execute('FV_BOOK_ENTRY_DISABLE', 'FVDisableDocument', {headers: {'X-NXenrichers.document': 'ancestry,permissions,book'}});
const askToDisableBookEntry = RESTActions.execute('FV_BOOK_ENTRY_DISABLE_WORKFLOW', 'Context.StartWorkflow', {headers: {'X-NXenrichers.document': 'ancestry,permissions,book'}});

const fetchBookEntries = RESTActions.query('FV_BOOK_ENTRIES', 'FVBookEntry', {headers: {'X-NXenrichers.document': 'ancestry,book,permissions'}});

const computeBookFetchFactory = RESTReducers.computeFetch('book');
const computeBooksQueryFactory = RESTReducers.computeQuery('books');
const computeBookDeleteFactory = RESTReducers.computeDelete('delete_book');

const computeBookEntryFetchFactory = RESTReducers.computeFetch('book_entry');
const computeBookEntriesQueryFactory = RESTReducers.computeQuery('book_entries');

const queryModifiedStories = RESTActions.query('FV_MODIFIED_STORIES', 'FVBook', {
    queryAppend: ' AND fvbook:type=\'story\'&sortBy=dc:modified&sortOrder=DESC&pageSize=4',
    headers: {'X-NXProperties': 'dublincore'}
});
const computeRecentlyModifiedStoriesQuery = RESTReducers.computeQuery('modified_stories');
const queryCreatedStories = RESTActions.query('FV_CREATED_STORIES', 'FVBook', {
    queryAppend: ' AND fvbook:type=\'story\'&sortBy=dc:created&sortOrder=DESC&pageSize=4',
    headers: {'X-NXProperties': 'dublincore'}
});
const computeRecentlyCreatedStoriesQuery = RESTReducers.computeQuery('created_stories');

const queryModifiedSongs = RESTActions.query('FV_MODIFIED_SONGS', 'FVBook', {
    queryAppend: ' AND fvbook:type=\'song\'&sortBy=dc:modified&sortOrder=DESC&pageSize=4',
    headers: {'X-NXProperties': 'dublincore'}
});
const computeRecentlyModifiedSongsQuery = RESTReducers.computeQuery('modified_songs');
const queryCreatedSongs = RESTActions.query('FV_CREATED_SONGS', 'FVBook', {
    queryAppend: ' AND fvbook:type=\'song\'&sortBy=dc:created&sortOrder=DESC&pageSize=4',
    headers: {'X-NXProperties': 'dublincore'}
});
const computeRecentlyCreatedSongsQuery = RESTReducers.computeQuery('created_songs');
const queryUserModifiedStories = function queryUserModifiedStories(pathOrId, user) {
    return function (dispatch) {

        dispatch({type: FV_STORIES_USER_MODIFIED_QUERY_START});

        return DirectoryOperations.getDocuments(pathOrId, 'FVBook', ' AND fvbook:type=\'story\' AND dc:lastContributor=\'' + user + '\'&sortBy=dc:modified&sortOrder=DESC&pageSize=4', {'X-NXProperties': 'dublincore'})
            .then((response) => {
                dispatch({type: FV_STORIES_USER_MODIFIED_QUERY_SUCCESS, document: response})
            }).catch((error) => {
                dispatch({type: FV_STORIES_USER_MODIFIED_QUERY_ERROR, error: error})
            });
    }
};

const queryUserCreatedStories = function queryUserCreatedStories(pathOrId, user) {
    return function (dispatch) {

        dispatch({type: FV_STORIES_USER_CREATED_QUERY_START});

        return DirectoryOperations.getDocuments(pathOrId, 'FVBook', ' AND fvbook:type=\'story\' AND dc:lastContributor=\'' + user + '\'&sortBy=dc:created&sortOrder=DESC&pageSize=4', {'X-NXProperties': 'dublincore'})
            .then((response) => {
                dispatch({type: FV_STORIES_USER_CREATED_QUERY_SUCCESS, document: response})
            }).catch((error) => {
                dispatch({type: FV_STORIES_USER_CREATED_QUERY_ERROR, error: error})
            });
    }
};

const queryUserModifiedSongs = function queryUserModifiedSongs(pathOrId, user) {
    return function (dispatch) {

        dispatch({type: FV_SONGS_USER_MODIFIED_QUERY_START});

        return DirectoryOperations.getDocuments(pathOrId, 'FVBook', ' AND fvbook:type=\'song\' AND dc:lastContributor=\'' + user + '\'&sortBy=dc:modified&sortOrder=DESC&pageSize=4', {'X-NXProperties': 'dublincore'})
            .then((response) => {
                dispatch({type: FV_SONGS_USER_MODIFIED_QUERY_SUCCESS, document: response})
            }).catch((error) => {
                dispatch({type: FV_SONGS_USER_MODIFIED_QUERY_ERROR, error: error})
            });
    }
};

const queryUserCreatedSongs = function queryUserCreatedSongs(pathOrId, user) {
    return function (dispatch) {

        dispatch({type: FV_SONGS_USER_CREATED_QUERY_START});

        return DirectoryOperations.getDocuments(pathOrId, 'FVBook', ' AND fvbook:type=\'song\' AND dc:lastContributor=\'' + user + '\'&sortBy=dc:created&sortOrder=DESC&pageSize=4', {'X-NXProperties': 'dublincore'})
            .then((response) => {
                dispatch({type: FV_SONGS_USER_CREATED_QUERY_SUCCESS, document: response})
            }).catch((error) => {
                dispatch({type: FV_SONGS_USER_CREATED_QUERY_ERROR, error: error})
            });
    }
};

const actions = {
    fetchBook,
    updateBook,
    fetchBooks,
    createBook,
    deleteBook,
    publishBook,
    unpublishBook,
    enableBook,
    disableBook,
    fetchSharedBooks,
    fetchBookEntries,
    fetchBooksAll,
    askToPublishBook,
    askToUnpublishBook,
    askToEnableBook,
    askToDisableBook,
    fetchBookEntry,
    updateBookEntry,
    createBookEntry,
    deleteBookEntry,
    publishBookEntry,
    unpublishBookEntry,
    enableBookEntry,
    disableBookEntry,
    askToPublishBookEntry,
    askToUnpublishBookEntry,
    askToEnableBookEntry,
    askToDisableBookEntry,
    queryModifiedStories,
    queryCreatedStories,
    queryModifiedSongs,
    queryCreatedSongs,
    queryUserModifiedStories,
    queryUserCreatedStories,
    queryUserModifiedSongs,
    queryUserCreatedSongs
};

const reducers = {
    computeBook: computeBookFetchFactory.computeBook,
    computeDeleteBook: computeBookDeleteFactory.computeDeleteBook,
    computeBookEntry: computeBookEntryFetchFactory.computeBookEntry,
    computeBookEntries: computeBookEntriesQueryFactory.computeBookEntries,
    computeBooks: computeBooksQueryFactory.computeBooks,
    computeSharedBooks(state = {
        isFetching: false, response: {
            get: function () {
                return '';
            }
        }, success: false
    }, action) {
        switch (action.type) {
            case FV_BOOKS_SHARED_FETCH_START:
                return Object.assign({}, state, {isFetching: true});
                break;

            // Send modified document to UI without access REST end-point
            case FV_BOOKS_SHARED_FETCH_SUCCESS:
                return Object.assign({}, state, {response: action.documents, isFetching: false, success: true});
                break;

            // Send modified document to UI without access REST end-point
            case FV_BOOKS_SHARED_FETCH_ERROR:
                return Object.assign({}, state, {
                    isFetching: false,
                    isError: true,
                    error: action.error,
                    errorDismissed: (action.type === DISMISS_ERROR) ? true : false
                });
                break;

            default:
                return Object.assign({}, state, {isFetching: false});
                break;
        }
    },
    computeBookEntriesInPath(state = {
        isFetching: false, response: {
            get: function () {
                return '';
            }
        }, success: false
    }, action) {
        switch (action.type) {
            case FV_BOOK_ENTRIES_FETCH_START:
                return Object.assign({}, state, {isFetching: true});
                break;

            // Send modified document to UI without access REST end-point
            case FV_BOOK_ENTRIES_FETCH_SUCCESS:
                return Object.assign({}, state, {response: action.documents, isFetching: false, success: true});
                break;

            // Send modified document to UI without access REST end-point
            case FV_BOOK_ENTRIES_FETCH_ERROR:
                return Object.assign({}, state, {isFetching: false, isError: true, error: action.error});
                break;

            default:
                return Object.assign({}, state, {isFetching: false});
                break;
        }
    },
    computeBooksAll(state = {
        isFetching: false, response: {
            get: function () {
                return '';
            }
        }, success: false
    }, action) {
        switch (action.type) {
            case FV_BOOK_FETCH_ALL_START:
                return Object.assign({}, state, {isFetching: true, success: false});
                break;

            case FV_BOOK_FETCH_ALL_SUCCESS:
                return Object.assign({}, state, {response: action.documents, isFetching: false, success: true});
                break;

            case FV_BOOK_FETCH_ALL_ERROR:
            case DISMISS_ERROR:
                return Object.assign({}, state, {
                    isFetching: false,
                    isError: true,
                    error: action.error,
                    errorDismissed: (action.type === DISMISS_ERROR) ? true : false
                });
                break;

            default:
                return Object.assign({}, state, {isFetching: false});
                break;
        }
    },
    computeModifiedStories: computeRecentlyModifiedStoriesQuery.computeModifiedStories,
    computeCreatedStories: computeRecentlyCreatedStoriesQuery.computeCreatedStories,
    computeModifiedSongs: computeRecentlyModifiedSongsQuery.computeModifiedSongs,
    computeCreatedSongs: computeRecentlyCreatedSongsQuery.computeCreatedSongs,
    computeUserModifiedStories(state = {
        isFetching: false, response: {
            get: function () {
                return '';
            }
        }, success: false
    }, action) {
        switch (action.type) {
            case FV_STORIES_USER_MODIFIED_QUERY_START:
                return Object.assign({}, state, {isFetching: true});
                break;

            // Send modified document to UI without access REST end-point
            case FV_STORIES_USER_MODIFIED_QUERY_SUCCESS:
                return Object.assign({}, state, {response: action.document, isFetching: false, success: true});
                break;

            // Send modified document to UI without access REST end-point
            case FV_STORIES_USER_MODIFIED_QUERY_ERROR:
            case DISMISS_ERROR:
                return Object.assign({}, state, {
                    isFetching: false,
                    isError: true,
                    error: action.error,
                    errorDismissed: (action.type === DISMISS_ERROR) ? true : false
                });
                break;

            default:
                return Object.assign({}, state, {isFetching: false});
                break;
        }
    },
    computeUserCreatedStories(state = {
        isFetching: false, response: {
            get: function () {
                return '';
            }
        }, success: false
    }, action) {
        switch (action.type) {
            case FV_STORIES_USER_CREATED_QUERY_START:
                return Object.assign({}, state, {isFetching: true});
                break;

            // Send modified document to UI without access REST end-point
            case FV_STORIES_USER_CREATED_QUERY_SUCCESS:
                return Object.assign({}, state, {response: action.document, isFetching: false, success: true});
                break;

            // Send modified document to UI without access REST end-point
            case FV_STORIES_USER_CREATED_QUERY_ERROR:
            case DISMISS_ERROR:
                return Object.assign({}, state, {
                    isFetching: false,
                    isError: true,
                    error: action.error,
                    errorDismissed: (action.type === DISMISS_ERROR) ? true : false
                });
                break;

            default:
                return Object.assign({}, state, {isFetching: false});
                break;
        }
    },
    computeUserModifiedSongs(state = {
        isFetching: false, response: {
            get: function () {
                return '';
            }
        }, success: false
    }, action) {
        switch (action.type) {
            case FV_SONGS_USER_MODIFIED_QUERY_START:
                return Object.assign({}, state, {isFetching: true});
                break;

            // Send modified document to UI without access REST end-point
            case FV_SONGS_USER_MODIFIED_QUERY_SUCCESS:
                return Object.assign({}, state, {response: action.document, isFetching: false, success: true});
                break;

            // Send modified document to UI without access REST end-point
            case FV_SONGS_USER_MODIFIED_QUERY_ERROR:
            case DISMISS_ERROR:
                return Object.assign({}, state, {
                    isFetching: false,
                    isError: true,
                    error: action.error,
                    errorDismissed: (action.type === DISMISS_ERROR) ? true : false
                });
                break;

            default:
                return Object.assign({}, state, {isFetching: false});
                break;
        }
    },
    computeUserCreatedSongs(state = {
        isFetching: false, response: {
            get: function () {
                return '';
            }
        }, success: false
    }, action) {
        switch (action.type) {
            case FV_SONGS_USER_CREATED_QUERY_START:
                return Object.assign({}, state, {isFetching: true});
                break;

            // Send modified document to UI without access REST end-point
            case FV_SONGS_USER_CREATED_QUERY_SUCCESS:
                return Object.assign({}, state, {response: action.document, isFetching: false, success: true});
                break;

            // Send modified document to UI without access REST end-point
            case FV_SONGS_USER_CREATED_QUERY_ERROR:
            case DISMISS_ERROR:
                return Object.assign({}, state, {
                    isFetching: false,
                    isError: true,
                    error: action.error,
                    errorDismissed: (action.type === DISMISS_ERROR) ? true : false
                });
                break;

            default:
                return Object.assign({}, state, {isFetching: false});
                break;
        }
    }
};

const middleware = [thunk];

export default {actions, reducers, middleware};