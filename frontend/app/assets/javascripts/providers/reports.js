// Middleware
import thunk from 'redux-thunk';

// Operations
import DirectoryOperations from 'operations/DirectoryOperations';
import DocumentOperations from 'operations/DocumentOperations';

const REPORT_DOCUMENTS_FETCH_START = "REPORT_DOCUMENTS_FETCH_START";
const REPORT_DOCUMENTS_FETCH_SUCCESS = "REPORT_DOCUMENTS_FETCH_SUCCESS";
const REPORT_DOCUMENTS_FETCH_ERROR = "REPORT_DOCUMENTS_FETCH_ERROR";

const REPORT_WORDS_ALL_FETCH_START = "REPORT_WORDS_ALL_FETCH_START";
const REPORT_WORDS_ALL_FETCH_SUCCESS = "REPORT_WORDS_ALL_FETCH_SUCCESS";
const REPORT_WORDS_ALL_FETCH_ERROR = "REPORT_WORDS_ALL_FETCH_ERROR";

const REPORT_PHRASES_ALL_FETCH_START = "REPORT_PHRASES_ALL_FETCH_START";
const REPORT_PHRASES_ALL_FETCH_SUCCESS = "REPORT_PHRASES_ALL_FETCH_SUCCESS";
const REPORT_PHRASES_ALL_FETCH_ERROR = "REPORT_PHRASES_ALL_FETCH_ERROR";

const REPORT_SONGS_ALL_FETCH_START = "REPORT_SONGS_ALL_FETCH_START";
const REPORT_SONGS_ALL_FETCH_SUCCESS = "REPORT_SONGS_ALL_FETCH_SUCCESS";
const REPORT_SONGS_ALL_FETCH_ERROR = "REPORT_SONGS_ALL_FETCH_ERROR";

const REPORT_STORIES_ALL_FETCH_START = "REPORT_STORIES_ALL_FETCH_START";
const REPORT_STORIES_ALL_FETCH_SUCCESS = "REPORT_STORIES_ALL_FETCH_SUCCESS";
const REPORT_STORIES_ALL_FETCH_ERROR = "REPORT_STORIES_ALL_FETCH_ERROR";

const fetchReportDocuments = function fetchReportDocuments(path, queryAppend, page, pageSize) {
    return function (dispatch) {

        dispatch({type: REPORT_DOCUMENTS_FETCH_START});

        return DocumentOperations.queryDocumentsByDialect("/" + path, queryAppend,
            {'X-NXproperties': 'dublincore, fv-word, fvcore'},
            {'currentPageIndex': page, 'pageSize': pageSize}
        )
            .then((response) => {
                dispatch({type: REPORT_DOCUMENTS_FETCH_SUCCESS, documents: response})
            }).catch((error) => {
                dispatch({type: REPORT_DOCUMENTS_FETCH_ERROR, error: error})
            });
    }
};

const fetchReportWordsAll = function fetchReportWordsAll(path) {
    return function (dispatch) {

        dispatch({type: REPORT_WORDS_ALL_FETCH_START});

        return DocumentOperations.queryDocumentsByDialect("/" + path, " AND ecm:primaryType='FVWord'",
            {'X-NXproperties': 'dublincore, fv-word, fvcore'},
            {'currentPageIndex': 0, 'pageSize': 10}
        )
            .then((response) => {
                dispatch({type: REPORT_WORDS_ALL_FETCH_SUCCESS, documents: response})
            }).catch((error) => {
                dispatch({type: REPORT_WORDS_ALL_FETCH_ERROR, error: error})
            });
    }
};

const fetchReportPhrasesAll = function fetchReportPhrasesAll(path) {
    return function (dispatch) {

        dispatch({type: REPORT_PHRASES_ALL_FETCH_START});

        return DocumentOperations.queryDocumentsByDialect("/" + path, " AND ecm:primaryType='FVPhrase'",
            {'X-NXproperties': 'dublincore, fv-phrase, fvcore'},
            {'currentPageIndex': 0, 'pageSize': 10}
        )
            .then((response) => {
                dispatch({type: REPORT_PHRASES_ALL_FETCH_SUCCESS, documents: response})
            }).catch((error) => {
                dispatch({type: REPORT_PHRASES_ALL_FETCH_ERROR, error: error})
            });
    }
};

const fetchReportSongsAll = function fetchReportSongsAll(path) {
    return function (dispatch) {

        dispatch({type: REPORT_SONGS_ALL_FETCH_START});

        return DocumentOperations.queryDocumentsByDialect("/" + path, " AND ecm:primaryType='FVBook' AND fvbook:type='song'",
            {'X-NXproperties': 'dublincore, fvbook, fvcore'},
            {'currentPageIndex': 0, 'pageSize': 10}
        )
            .then((response) => {
                dispatch({type: REPORT_SONGS_ALL_FETCH_SUCCESS, documents: response})
            }).catch((error) => {
                dispatch({type: REPORT_SONGS_ALL_FETCH_ERROR, error: error})
            });
    }
};

const fetchReportStoriesAll = function fetchReportStoriesAll(path) {
    return function (dispatch) {

        dispatch({type: REPORT_STORIES_ALL_FETCH_START});

        return DocumentOperations.queryDocumentsByDialect("/" + path, " AND ecm:primaryType='FVBook' AND fvbook:type='story'",
            {'X-NXproperties': 'dublincore, fvbook, fvcore'},
            {'currentPageIndex': 0, 'pageSize': 10}
        )
            .then((response) => {
                dispatch({type: REPORT_STORIES_ALL_FETCH_SUCCESS, documents: response})
            }).catch((error) => {
                dispatch({type: REPORT_STORIES_ALL_FETCH_ERROR, error: error})
            });
    }
};

const actions = {
    fetchReportDocuments,
    fetchReportWordsAll,
    fetchReportPhrasesAll,
    fetchReportSongsAll,
    fetchReportStoriesAll
};

const reducers = {
    computeReportDocuments(state = {
        isFetching: false, response: {
            get: function () {
                return '';
            }
        }, success: false
    }, action) {
        switch (action.type) {
            case REPORT_DOCUMENTS_FETCH_START:
                return Object.assign({}, state, {isFetching: true});
                break;

            case REPORT_DOCUMENTS_FETCH_SUCCESS:
                return Object.assign({}, state, {response: action.documents, isFetching: false, success: true});
                break;

            case REPORT_DOCUMENTS_FETCH_ERROR:
                return Object.assign({}, state, {isFetching: false, isError: true, error: action.error});
                break;

            default:
                return Object.assign({}, state, {isFetching: false});
                break;
        }
    },

    computeReportWordsAll(state = {
        isFetching: false, response: {
            get: function () {
                return '';
            }
        }, success: false
    }, action) {
        switch (action.type) {
            case REPORT_WORDS_ALL_FETCH_START:
                return Object.assign({}, state, {isFetching: true});
                break;

            case REPORT_WORDS_ALL_FETCH_SUCCESS:
                return Object.assign({}, state, {response: action.documents, isFetching: false, success: true});
                break;

            case REPORT_WORDS_ALL_FETCH_ERROR:
                return Object.assign({}, state, {isFetching: false, isError: true, error: action.error});
                break;

            default:
                return Object.assign({}, state, {isFetching: false});
                break;
        }
    },

    computeReportPhrasesAll(state = {
        isFetching: false, response: {
            get: function () {
                return '';
            }
        }, success: false
    }, action) {
        switch (action.type) {
            case REPORT_PHRASES_ALL_FETCH_START:
                return Object.assign({}, state, {isFetching: true});
                break;

            case REPORT_PHRASES_ALL_FETCH_SUCCESS:
                return Object.assign({}, state, {response: action.documents, isFetching: false, success: true});
                break;

            case REPORT_PHRASES_ALL_FETCH_ERROR:
                return Object.assign({}, state, {isFetching: false, isError: true, error: action.error});
                break;

            default:
                return Object.assign({}, state, {isFetching: false});
                break;
        }
    },

    computeReportSongsAll(state = {
        isFetching: false, response: {
            get: function () {
                return '';
            }
        }, success: false
    }, action) {
        switch (action.type) {
            case REPORT_SONGS_ALL_FETCH_START:
                return Object.assign({}, state, {isFetching: true});
                break;

            case REPORT_SONGS_ALL_FETCH_SUCCESS:
                return Object.assign({}, state, {response: action.documents, isFetching: false, success: true});
                break;

            case REPORT_SONGS_ALL_FETCH_ERROR:
                return Object.assign({}, state, {isFetching: false, isError: true, error: action.error});
                break;

            default:
                return Object.assign({}, state, {isFetching: false});
                break;
        }
    },

    computeReportStoriesAll(state = {
        isFetching: false, response: {
            get: function () {
                return '';
            }
        }, success: false
    }, action) {
        switch (action.type) {
            case REPORT_STORIES_ALL_FETCH_START:
                return Object.assign({}, state, {isFetching: true});
                break;

            case REPORT_STORIES_ALL_FETCH_SUCCESS:
                return Object.assign({}, state, {response: action.documents, isFetching: false, success: true});
                break;

            case REPORT_STORIES_ALL_FETCH_ERROR:
                return Object.assign({}, state, {isFetching: false, isError: true, error: action.error});
                break;

            default:
                return Object.assign({}, state, {isFetching: false});
                break;
        }
    }
};

const middleware = [thunk];

export default {actions, reducers, middleware};