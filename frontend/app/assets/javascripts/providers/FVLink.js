import Immutable, {List, Map} from 'immutable';

import RESTActions from './rest-actions'
import RESTReducers from './rest-reducers'

// Middleware
import thunk from 'redux-thunk';

// Operations
import DirectoryOperations from 'operations/DirectoryOperations';

const FV_LINKS_SHARED_FETCH_START = "FV_LINKS_SHARED_FETCH_START";
const FV_LINKS_SHARED_FETCH_SUCCESS = "FV_LINKS_SHARED_FETCH_SUCCESS";
const FV_LINKS_SHARED_FETCH_ERROR = "FV_LINKS_SHARED_FETCH_ERROR";

const fetchSharedLinks = function fetchSharedLinks(page_provider, headers = {}, params = {}) {
    return function (dispatch) {

        dispatch({type: FV_LINKS_SHARED_FETCH_START});

        return DirectoryOperations.getDocumentsViaPageProvider(page_provider, 'FVLink', headers, params)
            .then((response) => {
                dispatch({type: FV_LINKS_SHARED_FETCH_SUCCESS, documents: response})
            }).catch((error) => {
                dispatch({type: FV_LINKS_SHARED_FETCH_ERROR, error: error})
            });
    }
};

const fetchLink = RESTActions.fetch('FV_LINK', 'FVLink', {headers: {'X-NXenrichers.document': 'ancestry, breadcrumb'}});
const fetchLinks = RESTActions.query('FV_LINKS', 'FVLink', {headers: {'X-NXenrichers.document': 'ancestry'}});
const createLink = RESTActions.create('FV_LINK', 'FVLink');
const updateLink = RESTActions.update('FV_LINK', 'FVLink', {headers: {'X-NXenrichers.document': 'ancestry,permissions'}}, false);

const computeLinkFactory = RESTReducers.computeFetch('link');
const computeLinksFactory = RESTReducers.computeQuery('links');

const actions = {fetchSharedLinks, fetchLink, fetchLinks, createLink, updateLink};

const reducers = {
    computeLink: computeLinkFactory.computeLink,
    computeLinks: computeLinksFactory.computeLinks,
    computeSharedLinks(state = {
        isFetching: false, response: {
            get: function () {
                return '';
            }
        }, success: false
    }, action) {
        switch (action.type) {
            case FV_LINKS_SHARED_FETCH_START:
                return Object.assign({}, state, {isFetching: true});
                break;

            // Send modified document to UI without access REST end-point
            case FV_LINKS_SHARED_FETCH_SUCCESS:
                return Object.assign({}, state, {response: action.documents, isFetching: false, success: true});
                break;

            // Send modified document to UI without access REST end-point
            case FV_LINKS_SHARED_FETCH_ERROR:
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