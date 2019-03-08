import Immutable, {List, Map} from 'immutable';

import RESTActions from './rest-actions'
import RESTReducers from './rest-reducers'

// Middleware
import thunk from 'redux-thunk';

// Operations
import DirectoryOperations from 'operations/DirectoryOperations';
import DocumentOperations from 'operations/DocumentOperations';

const DISMISS_ERROR = 'DISMISS_ERROR';

/**
 * Multiple Contributor Actions
 */
const FV_CONTRIBUTORS_FETCH_START = "FV_CONTRIBUTORS_FETCH_START";
const FV_CONTRIBUTORS_FETCH_SUCCESS = "FV_CONTRIBUTORS_FETCH_SUCCESS";
const FV_CONTRIBUTORS_FETCH_ERROR = "FV_CONTRIBUTORS_FETCH_ERROR";

const FV_CONTRIBUTORS_UPDATE_START = "FV_CONTRIBUTORS_UPDATE_START";
const FV_CONTRIBUTORS_UPDATE_SUCCESS = "FV_CONTRIBUTORS_UPDATE_SUCCESS";
const FV_CONTRIBUTORS_UPDATE_ERROR = "FV_CONTRIBUTORS_UPDATE_ERROR";

const FV_CONTRIBUTORS_CREATE_START = "FV_CONTRIBUTORS_CREATE_START";
const FV_CONTRIBUTORS_CREATE_SUCCESS = "FV_CONTRIBUTORS_CREATE_SUCCESS";
const FV_CONTRIBUTORS_CREATE_ERROR = "FV_CONTRIBUTORS_CREATE_ERROR";

const FV_CONTRIBUTORS_DELETE_START = "FV_CONTRIBUTORS_DELETE_START";
const FV_CONTRIBUTORS_DELETE_SUCCESS = "FV_CONTRIBUTORS_DELETE_SUCCESS";
const FV_CONTRIBUTORS_DELETE_ERROR = "FV_CONTRIBUTORS_DELETE_ERROR";

const FV_CONTRIBUTORS_SHARED_FETCH_START = "FV_CONTRIBUTORS_SHARED_FETCH_START";
const FV_CONTRIBUTORS_SHARED_FETCH_SUCCESS = "FV_CONTRIBUTORS_SHARED_FETCH_SUCCESS";
const FV_CONTRIBUTORS_SHARED_FETCH_ERROR = "FV_CONTRIBUTORS_SHARED_FETCH_ERROR";

/**
 * Single Contributor Actions
 */
const FV_CONTRIBUTOR_FETCH_START = "FV_CONTRIBUTOR_FETCH_START";
const FV_CONTRIBUTOR_FETCH_SUCCESS = "FV_CONTRIBUTOR_FETCH_SUCCESS";
const FV_CONTRIBUTOR_FETCH_ERROR = "FV_CONTRIBUTOR_FETCH_ERROR";

const FV_CONTRIBUTOR_FETCH_ALL_START = "FV_CONTRIBUTOR_FETCH_ALL_START";
const FV_CONTRIBUTOR_FETCH_ALL_SUCCESS = "FV_CONTRIBUTOR_FETCH_ALL_SUCCESS";
const FV_CONTRIBUTOR_FETCH_ALL_ERROR = "FV_CONTRIBUTOR_FETCH_ALL_ERROR";

const FV_CONTRIBUTOR_UPDATE_START = "FV_CONTRIBUTOR_UPDATE_START";
const FV_CONTRIBUTOR_UPDATE_SUCCESS = "FV_CONTRIBUTOR_UPDATE_SUCCESS";
const FV_CONTRIBUTOR_UPDATE_ERROR = "FV_CONTRIBUTOR_UPDATE_ERROR";

const FV_CONTRIBUTOR_CREATE_START = "FV_CONTRIBUTOR_CREATE_START";
const FV_CONTRIBUTOR_CREATE_SUCCESS = "FV_CONTRIBUTOR_CREATE_SUCCESS";
const FV_CONTRIBUTOR_CREATE_ERROR = "FV_CONTRIBUTOR_CREATE_ERROR";

const FV_CONTRIBUTOR_DELETE_START = "FV_CONTRIBUTOR_DELETE_START";
const FV_CONTRIBUTOR_DELETE_SUCCESS = "FV_CONTRIBUTOR_DELETE_SUCCESS";
const FV_CONTRIBUTOR_DELETE_ERROR = "FV_CONTRIBUTOR_DELETE_ERROR";

const fetchSharedContributors = function fetchSharedContributors(page_provider, headers = {}, params = {}) {
    return function (dispatch) {

        dispatch({type: FV_CONTRIBUTORS_SHARED_FETCH_START});

        return DirectoryOperations.getDocumentsViaPageProvider(page_provider, 'FVContributor', headers, params)
            .then((response) => {
                dispatch({type: FV_CONTRIBUTORS_SHARED_FETCH_SUCCESS, documents: response})
            }).catch((error) => {
                dispatch({type: FV_CONTRIBUTORS_SHARED_FETCH_ERROR, error: error})
            });
    }
};

const fetchContributorsAll = function fetchContributorsAll(path, type) {
    return function (dispatch) {

        dispatch({type: FV_CONTRIBUTOR_FETCH_ALL_START});

        return DirectoryOperations.getDocuments(path, 'FVContributor', '', {headers: {'X-NXenrichers.document': 'ancestry'}})
            .then((response) => {
                dispatch({type: FV_CONTRIBUTOR_FETCH_ALL_SUCCESS, documents: response})
            }).catch((error) => {
                dispatch({type: FV_CONTRIBUTOR_FETCH_ALL_ERROR, error: error})
            });
    }
};

const fetchContributorsInPath = function fetchContributorsInPath(path, queryAppend, headers = {}, params = {}) {
    return function (dispatch) {

        dispatch({type: FV_CONTRIBUTORS_FETCH_START});

        return DirectoryOperations.getDocuments(path, 'FVContributor', queryAppend, headers, params)
            .then((response) => {
                dispatch({type: FV_CONTRIBUTORS_FETCH_SUCCESS, documents: response})
            }).catch((error) => {
                dispatch({type: FV_CONTRIBUTORS_FETCH_ERROR, error: error})
            });
    }
};
/*
const fetchContributor = function fetchContributor(pathOrId) {
  return function (dispatch) {

    let contributors = {};
    contributors[pathOrId] = {};

    dispatch( { type: FV_CONTRIBUTOR_FETCH_START, contributors: contributors, pathOrId: pathOrId } );

    return DocumentOperations.getDocument(pathOrId, 'FVContributor', { headers: { 'X-NXenrichers.document': 'ancestry' } })
    .then((response) => {

      contributors[pathOrId] = { response: response };

      dispatch( { type: FV_CONTRIBUTOR_FETCH_SUCCESS, contributors: contributors, pathOrId: pathOrId } )
    }).catch((error) => {

        contributors[pathOrId] = { error: error };

        dispatch( { type: FV_CONTRIBUTOR_FETCH_ERROR, contributors: contributors, pathOrId: pathOrId } )
    });
  }
};
*/

const fetchContributor = RESTActions.fetch('FV_CONTRIBUTOR', 'FVContributor', {headers: {'X-NXenrichers.document': 'ancestry'}});
const fetchContributors = RESTActions.query('FV_CONTRIBUTORS', 'FVContributor', {headers: {'X-NXenrichers.document': 'ancestry'}});
const createContributor = RESTActions.create('FV_CONTRIBUTOR', 'FVContributor');
const updateContributor = RESTActions.update('FV_CONTRIBUTOR', 'FVContributor', {headers: {'X-NXenrichers.document': 'ancestry'}}, false);

const computeContributorFactory = RESTReducers.computeFetch('contributor');
const computeContributorsFactory = RESTReducers.computeQuery('contributors');

const actions = {
    fetchSharedContributors,
    fetchContributorsInPath,
    fetchContributor,
    fetchContributors,
    createContributor,
    fetchContributorsAll,
    updateContributor
};

const reducers = {
    computeSharedContributors(state = {
        isFetching: false, response: {
            get: function () {
                return '';
            }
        }, success: false
    }, action) {
        switch (action.type) {
            case FV_CONTRIBUTORS_SHARED_FETCH_START:
                return Object.assign({}, state, {isFetching: true});
                break;

            // Send modified document to UI without access REST end-point
            case FV_CONTRIBUTORS_SHARED_FETCH_SUCCESS:
                return Object.assign({}, state, {response: action.documents, isFetching: false, success: true});
                break;

            // Send modified document to UI without access REST end-point
            case FV_CONTRIBUTORS_SHARED_FETCH_ERROR:
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
    computeContributorsInPath(state = {
        isFetching: false, response: {
            get: function () {
                return '';
            }
        }, success: false
    }, action) {
        switch (action.type) {
            case FV_CONTRIBUTORS_FETCH_START:
                return Object.assign({}, state, {isFetching: true});
                break;

            // Send modified document to UI without access REST end-point
            case FV_CONTRIBUTORS_FETCH_SUCCESS:
                return Object.assign({}, state, {response: action.documents, isFetching: false, success: true});
                break;

            // Send modified document to UI without access REST end-point
            case FV_CONTRIBUTORS_FETCH_ERROR:
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
    computeContributor: computeContributorFactory.computeContributor,
    computeContributors: computeContributorsFactory.computeContributors,

    /*
      computeContributor(state = { contributors: {} }, action) {
        switch (action.type) {
          case FV_CONTRIBUTOR_FETCH_START:
          case FV_CONTRIBUTOR_UPDATE_START:

            action.contributors[action.pathOrId].isFetching = true;
            action.contributors[action.pathOrId].success = false;

            return Object.assign({}, state, { contributors: Object.assign(state.contributors, action.contributors) });
          break;

          // Send modified document to UI without access REST end-point
          case FV_CONTRIBUTOR_FETCH_SUCCESS:
          case FV_CONTRIBUTOR_UPDATE_SUCCESS:

            action.contributors[action.pathOrId].isFetching = false;
            action.contributors[action.pathOrId].success = true;

            return Object.assign({}, state, { contributors: Object.assign(state.contributors, action.contributors) });
          break;

          // Send modified document to UI without access REST end-point
          case FV_CONTRIBUTOR_FETCH_ERROR:
          case FV_CONTRIBUTOR_UPDATE_ERROR:

            action.contributors[action.pathOrId].isFetching = false;
            action.contributors[action.pathOrId].success = false;
            action.contributors[action.pathOrId].isError = true;
            action.contributors[action.pathOrId].error = action.error;

            return Object.assign({}, state, { contributors: Object.assign(state.contributors, action.contributors) });
          break;

          default:
            return Object.assign({}, state);
          break;
        }
      },
    */

    computeCreateContributor(state = {
        isFetching: false, response: {
            get: function () {
                return '';
            }
        }, success: false, pathOrId: null
    }, action) {
        switch (action.type) {
            case FV_CONTRIBUTOR_CREATE_START:
                return Object.assign({}, state, {isFetching: true, success: false, pathOrId: action.pathOrId});
                break;

            // Send modified document to UI without access REST end-point
            case FV_CONTRIBUTOR_CREATE_SUCCESS:
                return Object.assign({}, state, {
                    response: action.document,
                    isFetching: false,
                    success: true,
                    pathOrId: action.pathOrId,
                    isError: false,
                    error: null
                });
                break;

            // Send modified document to UI without access REST end-point
            case FV_CONTRIBUTOR_CREATE_ERROR:
                return Object.assign({}, state, {
                    isFetching: false,
                    isError: true,
                    error: action.error,
                    pathOrId: action.pathOrId
                });
                break;

            default:
                return Object.assign({}, state, {isFetching: false});
                break;
        }
    },
    computeContributorsAll(state = {
        isFetching: false, response: {
            get: function () {
                return '';
            }
        }, success: false
    }, action) {
        switch (action.type) {
            case FV_CONTRIBUTOR_FETCH_ALL_START:
                return Object.assign({}, state, {isFetching: true, success: false});
                break;

            case FV_CONTRIBUTOR_FETCH_ALL_SUCCESS:
                return Object.assign({}, state, {response: action.documents, isFetching: false, success: true});
                break;

            case FV_CONTRIBUTOR_FETCH_ALL_ERROR:
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