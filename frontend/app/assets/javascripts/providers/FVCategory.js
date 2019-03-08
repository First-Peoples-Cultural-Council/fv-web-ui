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
 * Multiple Category Actions
 */
const FV_CATEGORIES_FETCH_START = "FV_CATEGORIES_FETCH_START";
const FV_CATEGORIES_FETCH_SUCCESS = "FV_CATEGORIES_FETCH_SUCCESS";
const FV_CATEGORIES_FETCH_ERROR = "FV_CATEGORIES_FETCH_ERROR";

const FV_CATEGORIES_UPDATE_START = "FV_CATEGORIES_UPDATE_START";
const FV_CATEGORIES_UPDATE_SUCCESS = "FV_CATEGORIES_UPDATE_SUCCESS";
const FV_CATEGORIES_UPDATE_ERROR = "FV_CATEGORIES_UPDATE_ERROR";

const FV_CATEGORIES_CREATE_START = "FV_CATEGORIES_CREATE_START";
const FV_CATEGORIES_CREATE_SUCCESS = "FV_CATEGORIES_CREATE_SUCCESS";
const FV_CATEGORIES_CREATE_ERROR = "FV_CATEGORIES_CREATE_ERROR";

const FV_CATEGORIES_DELETE_START = "FV_CATEGORIES_DELETE_START";
const FV_CATEGORIES_DELETE_SUCCESS = "FV_CATEGORIES_DELETE_SUCCESS";
const FV_CATEGORIES_DELETE_ERROR = "FV_CATEGORIES_DELETE_ERROR";

const FV_CATEGORIES_SHARED_FETCH_START = "FV_CATEGORIES_SHARED_FETCH_START";
const FV_CATEGORIES_SHARED_FETCH_SUCCESS = "FV_CATEGORIES_SHARED_FETCH_SUCCESS";
const FV_CATEGORIES_SHARED_FETCH_ERROR = "FV_CATEGORIES_SHARED_FETCH_ERROR";

/**
 * Single Category Actions
 */
const FV_CATEGORY_FETCH_START = "FV_CATEGORY_FETCH_START";
const FV_CATEGORY_FETCH_SUCCESS = "FV_CATEGORY_FETCH_SUCCESS";
const FV_CATEGORY_FETCH_ERROR = "FV_CATEGORY_FETCH_ERROR";

const FV_CATEGORY_FETCH_ALL_START = "FV_CATEGORY_FETCH_ALL_START";
const FV_CATEGORY_FETCH_ALL_SUCCESS = "FV_CATEGORY_FETCH_ALL_SUCCESS";
const FV_CATEGORY_FETCH_ALL_ERROR = "FV_CATEGORY_FETCH_ALL_ERROR";

const FV_CATEGORY_UPDATE_START = "FV_CATEGORY_UPDATE_START";
const FV_CATEGORY_UPDATE_SUCCESS = "FV_CATEGORY_UPDATE_SUCCESS";
const FV_CATEGORY_UPDATE_ERROR = "FV_CATEGORY_UPDATE_ERROR";

const FV_CATEGORY_CREATE_START = "FV_CATEGORY_CREATE_START";
const FV_CATEGORY_CREATE_SUCCESS = "FV_CATEGORY_CREATE_SUCCESS";
const FV_CATEGORY_CREATE_ERROR = "FV_CATEGORY_CREATE_ERROR";

const FV_CATEGORY_DELETE_START = "FV_CATEGORY_DELETE_START";
const FV_CATEGORY_DELETE_SUCCESS = "FV_CATEGORY_DELETE_SUCCESS";
const FV_CATEGORY_DELETE_ERROR = "FV_CATEGORY_DELETE_ERROR";
/*
const createCategory = function createCategory(parentDoc, docParams) {
  return function (dispatch) {

    dispatch( { type: FV_CATEGORY_CREATE_START, document: docParams } );

    return DocumentOperations.createDocument(parentDoc, docParams)
      .then((response) => {
        dispatch( { type: FV_CATEGORY_CREATE_SUCCESS, document: response} );
      }).catch((error) => {
          dispatch( { type: FV_CATEGORY_CREATE_ERROR, error: error } )
    });
  }
};
*/

const fetchSharedCategories = function fetchSharedCategories(page_provider, headers = {}, params = {}) {
    return function (dispatch) {

        dispatch({type: FV_CATEGORIES_SHARED_FETCH_START});

        return DirectoryOperations.getDocumentsViaPageProvider(page_provider, 'FVCategory', headers, params)
            .then((response) => {
                dispatch({type: FV_CATEGORIES_SHARED_FETCH_SUCCESS, documents: response})
            }).catch((error) => {
                dispatch({type: FV_CATEGORIES_SHARED_FETCH_ERROR, error: error})
            });
    }
};

const fetchCategoriesAll = function fetchCategoriesAll(path, type) {
    return function (dispatch) {

        dispatch({type: FV_CATEGORY_FETCH_ALL_START});

        return DirectoryOperations.getDocuments(path, 'FVCategory', '', {headers: {'X-NXenrichers.document': 'ancestry'}})
            .then((response) => {
                dispatch({type: FV_CATEGORY_FETCH_ALL_SUCCESS, documents: response})
            }).catch((error) => {
                dispatch({type: FV_CATEGORY_FETCH_ALL_ERROR, error: error})
            });
    }
};

const fetchCategoriesInPath = function fetchCategoriesInPath(path, queryAppend, headers = {}, params = {}) {
    return function (dispatch) {

        dispatch({type: FV_CATEGORIES_FETCH_START});

        return DirectoryOperations.getDocuments(path, 'FVCategory', queryAppend, headers, params)
            .then((response) => {
                dispatch({type: FV_CATEGORIES_FETCH_SUCCESS, documents: response})
            }).catch((error) => {
                dispatch({type: FV_CATEGORIES_FETCH_ERROR, error: error})
            });
    }
};
/*
const fetchCategory = function fetchCategory(pathOrId) {
  return function (dispatch) {

    let categories = {};
    categories[pathOrId] = {};

    dispatch( { type: FV_CATEGORY_FETCH_START, categories: categories, pathOrId: pathOrId } );

    return DocumentOperations.getDocument(pathOrId, 'FVCategory', { headers: { 'X-NXenrichers.document': 'ancestry, breadcrumb' } })
    .then((response) => {

      categories[pathOrId] = { response: response };

      dispatch( { type: FV_CATEGORY_FETCH_SUCCESS, categories: categories, pathOrId: pathOrId } )
    }).catch((error) => {

        categories[pathOrId] = { error: error };

        dispatch( { type: FV_CATEGORY_FETCH_ERROR, categories: categories, pathOrId: pathOrId } )
    });
  }
};
*/
const fetchCategory = RESTActions.fetch('FV_CATEGORY', 'FVCategory', {headers: {'X-NXenrichers.document': 'ancestry, breadcrumb'}});
const fetchCategories = RESTActions.query('FV_CATEGORIES', 'FVCategory', {headers: {'X-NXenrichers.document': 'ancestry, parentDoc, breadcrumb, children'}});
const createCategory = RESTActions.create('FV_CATEGORY', 'FVCategory');
const updateCategory = RESTActions.update('FV_CATEGORY', 'FVCategory', {headers: {'X-NXenrichers.document': 'ancestry,breadcrumb,permissions'}}, false);
const computeCategoryFactory = RESTReducers.computeFetch('category');
const computeCategoriesFactory = RESTReducers.computeQuery('categories');

const actions = {
    fetchSharedCategories,
    fetchCategoriesInPath,
    fetchCategories,
    fetchCategory,
    createCategory,
    fetchCategoriesAll,
    updateCategory
};

const reducers = {
    computeSharedCategories(state = {
        isFetching: false, response: {
            get: function () {
                return '';
            }
        }, success: false
    }, action) {
        switch (action.type) {
            case FV_CATEGORIES_SHARED_FETCH_START:
                return Object.assign({}, state, {isFetching: true});
                break;

            // Send modified document to UI without access REST end-point
            case FV_CATEGORIES_SHARED_FETCH_SUCCESS:
                return Object.assign({}, state, {response: action.documents, isFetching: false, success: true});
                break;

            // Send modified document to UI without access REST end-point
            case FV_CATEGORIES_SHARED_FETCH_ERROR:
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
    computeCategoriesInPath(state = {
        isFetching: false, response: {
            get: function () {
                return '';
            }
        }, success: false
    }, action) {
        switch (action.type) {
            case FV_CATEGORIES_FETCH_START:
                return Object.assign({}, state, {isFetching: true});
                break;

            // Send modified document to UI without access REST end-point
            case FV_CATEGORIES_FETCH_SUCCESS:
                return Object.assign({}, state, {response: action.documents, isFetching: false, success: true});
                break;

            // Send modified document to UI without access REST end-point
            case FV_CATEGORIES_FETCH_ERROR:
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
    computeCategory: computeCategoryFactory.computeCategory,
    computeCategories: computeCategoriesFactory.computeCategories,
    /*
      computeCategory(state = { categories: {} }, action) {
        switch (action.type) {
          case FV_CATEGORY_FETCH_START:
          case FV_CATEGORY_UPDATE_START:

            action.categories[action.pathOrId].isFetching = true;
            action.categories[action.pathOrId].success = false;

            return Object.assign({}, state, { categories: Object.assign(state.categories, action.categories) });
          break;

          // Send modified document to UI without access REST end-point
          case FV_CATEGORY_FETCH_SUCCESS:
          case FV_CATEGORY_UPDATE_SUCCESS:

            action.categories[action.pathOrId].isFetching = false;
            action.categories[action.pathOrId].success = true;

            return Object.assign({}, state, { categories: Object.assign(state.categories, action.categories) });
          break;

          // Send modified document to UI without access REST end-point
          case FV_CATEGORY_FETCH_ERROR:
          case FV_CATEGORY_UPDATE_ERROR:

            action.categories[action.pathOrId].isFetching = false;
            action.categories[action.pathOrId].success = false;
            action.categories[action.pathOrId].isError = true;
            action.categories[action.pathOrId].error = action.error;

            return Object.assign({}, state, { categories: Object.assign(state.categories, action.categories) });
          break;

          default:
            return Object.assign({}, state);
          break;
        }
      },
    */
    computeCreateCategory(state = {
        isFetching: false, response: {
            get: function () {
                return '';
            }
        }, success: false, pathOrId: null
    }, action) {
        switch (action.type) {
            case FV_CATEGORY_CREATE_START:
                return Object.assign({}, state, {isFetching: true, success: false, pathOrId: action.pathOrId});
                break;

            // Send modified document to UI without access REST end-point
            case FV_CATEGORY_CREATE_SUCCESS:
                return Object.assign({}, state, {
                    response: action.document,
                    isFetching: false,
                    success: true,
                    pathOrId: action.pathOrId
                });
                break;

            // Send modified document to UI without access REST end-point
            case FV_CATEGORY_CREATE_ERROR:
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
    computeCategoriesAll(state = {
        isFetching: false, response: {
            get: function () {
                return '';
            }
        }, success: false
    }, action) {
        switch (action.type) {
            case FV_CATEGORY_FETCH_ALL_START:
                return Object.assign({}, state, {isFetching: true, success: false});
                break;

            case FV_CATEGORY_FETCH_ALL_SUCCESS:
                return Object.assign({}, state, {response: action.documents, isFetching: false, success: true});
                break;

            case FV_CATEGORY_FETCH_ALL_ERROR:
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