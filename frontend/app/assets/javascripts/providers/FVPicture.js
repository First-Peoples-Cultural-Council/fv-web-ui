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
 * Multiple Picture Actions
 */
const FV_PICTURES_FETCH_START = "FV_PICTURES_FETCH_START";
const FV_PICTURES_FETCH_SUCCESS = "FV_PICTURES_FETCH_SUCCESS";
const FV_PICTURES_FETCH_ERROR = "FV_PICTURES_FETCH_ERROR";

const FV_PICTURES_UPDATE_START = "FV_PICTURES_UPDATE_START";
const FV_PICTURES_UPDATE_SUCCESS = "FV_PICTURES_UPDATE_SUCCESS";
const FV_PICTURES_UPDATE_ERROR = "FV_PICTURES_UPDATE_ERROR";

const FV_PICTURES_CREATE_START = "FV_PICTURES_CREATE_START";
const FV_PICTURES_CREATE_SUCCESS = "FV_PICTURES_CREATE_SUCCESS";
const FV_PICTURES_CREATE_ERROR = "FV_PICTURES_CREATE_ERROR";

const FV_PICTURES_DELETE_START = "FV_PICTURES_DELETE_START";
const FV_PICTURES_DELETE_SUCCESS = "FV_PICTURES_DELETE_SUCCESS";
const FV_PICTURES_DELETE_ERROR = "FV_PICTURES_DELETE_ERROR";

/**
 * Single Picture Actions
 */
const FV_PICTURE_FETCH_START = "FV_PICTURE_FETCH_START";
const FV_PICTURE_FETCH_SUCCESS = "FV_PICTURE_FETCH_SUCCESS";
const FV_PICTURE_FETCH_ERROR = "FV_PICTURE_FETCH_ERROR";

const FV_PICTURES_SHARED_FETCH_START = "FV_PICTURES_SHARED_FETCH_START";
const FV_PICTURES_SHARED_FETCH_SUCCESS = "FV_PICTURES_SHARED_FETCH_SUCCESS";
const FV_PICTURES_SHARED_FETCH_ERROR = "FV_PICTURES_SHARED_FETCH_ERROR";

const FV_PICTURE_FETCH_STATS_START = "FV_PICTURE_FETCH_STATS_START";
const FV_PICTURE_FETCH_STATS_SUCCESS = "FV_PICTURE_FETCH_STATS_SUCCESS";
const FV_PICTURE_FETCH_STATS_ERROR = "FV_PICTURE_FETCH_STATS_ERROR";

const FV_PICTURE_UPLOAD_START = "FV_PICTURE_UPLOAD_START";
const FV_PICTURE_UPLOAD_SUCCESS = "FV_PICTURE_UPLOAD_SUCCESS";
const FV_PICTURE_UPLOAD_ERROR = "FV_PICTURE_UPLOAD_ERROR";

const FV_PICTURE_UPDATE_START = "FV_PICTURE_UPDATE_START";
const FV_PICTURE_UPDATE_SUCCESS = "FV_PICTURE_UPDATE_SUCCESS";
const FV_PICTURE_UPDATE_ERROR = "FV_PICTURE_UPDATE_ERROR";

const FV_PICTURE_CREATE_START = "FV_PICTURE_CREATE_START";
const FV_PICTURE_CREATE_SUCCESS = "FV_PICTURE_CREATE_SUCCESS";
const FV_PICTURE_CREATE_ERROR = "FV_PICTURE_CREATE_ERROR";

const FV_PICTURE_DELETE_START = "FV_PICTURE_DELETE_START";
const FV_PICTURE_DELETE_SUCCESS = "FV_PICTURE_DELETE_SUCCESS";
const FV_PICTURE_DELETE_ERROR = "FV_PICTURE_DELETE_ERROR";


/*const createPicture = function createPicture(parentDoc, docParams, file) {
  return function (dispatch) {

    dispatch( { type: FV_PICTURE_CREATE_START, document: docParams } );

    return DocumentOperations.createDocumentWithBlob(parentDoc, docParams, file)
      .then((response) => {
        dispatch( { type: FV_PICTURE_CREATE_SUCCESS, document: response} );
      }).catch((error) => {
          dispatch( { type: FV_PICTURE_CREATE_ERROR, error: error } )
    });
  }
};*/


const updatePicture = function updatePicture(newDoc, field) {
    return function (dispatch) {

        let pictures = {};
        pictures[newDoc.id] = {};

        dispatch({type: FV_PICTURE_UPDATE_START, pictures: pictures, pathOrId: newDoc.id});

        return DocumentOperations.updateDocument(newDoc)
            .then((response) => {

                pictures[newDoc.id] = {response: response};

                dispatch({type: FV_PICTURE_UPDATE_SUCCESS, pictures: pictures, pathOrId: newDoc.id});
            }).catch((error) => {

                pictures[newDoc.id] = {error: error};

                dispatch({type: FV_PICTURE_UPDATE_ERROR, pictures: pictures, pathOrId: newDoc.id})
            });
    }
};

const fetchSharedPictures = function fetchSharedPictures(page_provider, headers = {}, params = {}) {
    return function (dispatch) {

        dispatch({type: FV_PICTURES_SHARED_FETCH_START});

        return DirectoryOperations.getDocumentsViaPageProvider(page_provider, 'FVPicture', headers, params)
            .then((response) => {
                dispatch({type: FV_PICTURES_SHARED_FETCH_SUCCESS, documents: response})
            }).catch((error) => {
                dispatch({type: FV_PICTURES_SHARED_FETCH_ERROR, error: error})
            });
    }
};

/*cosnt fetchPictureAndStats = function fetchPictureWithStats(path) {
	  return dispatch => Promise.all([
	    dispatch(fetchPicture(path)),
        dispatch(fetchPictureStats())
      ]);
}*/


/*const fetchPicture = function fetchPicture(pathOrId) {
  return function (dispatch) {

    let pictures = {};
    pictures[pathOrId] = {};

    dispatch( { type: FV_PICTURE_FETCH_START, pictures: pictures, pathOrId: pathOrId } );

    return DocumentOperations.getDocument(pathOrId, 'FVPicture', { headers: { 'X-NXenrichers.document': 'ancestry' } })
    .then((response) => {

      pictures[pathOrId] = { response: response };

      dispatch( { type: FV_PICTURE_FETCH_SUCCESS, pictures: pictures, pathOrId: pathOrId } )
    }).catch((error) => {

        pictures[pathOrId] = { error: error };

        dispatch( { type: FV_PICTURE_FETCH_ERROR, pictures: pictures, pathOrId: pathOrId } )
    });
  }
};*/

const fetchPictureStats = function fetchPictureStats(dialectId) {
    return function (dispatch) {

        dispatch({type: FV_PICTURE_FETCH_STATS_START});

        return DocumentOperations.getPictureStats(dialectId)
            .then((response) => {
                dispatch({type: FV_PICTURE_FETCH_STATS_SUCCESS, document: response})
            }).catch((error) => {
                dispatch({type: FV_PICTURE_FETCH_STATS_ERROR, error: error})
            });
    }
};

const fetchPicture = RESTActions.fetch('FV_PICTURE', 'FVPicture', {headers: {'X-NXenrichers.document': 'ancestry, media'}});
const createPicture = RESTActions.create('FV_PICTURE', 'FVPicture');

const actions = {fetchSharedPictures, createPicture, fetchPicture, updatePicture, fetchPictureStats};

const computePictureFactory = RESTReducers.computeFetch('picture');

const reducers = {
    computeSharedPictures(state = {
        isFetching: false, response: {
            get: function () {
                return '';
            }
        }, success: false
    }, action) {
        switch (action.type) {
            case FV_PICTURES_SHARED_FETCH_START:
                return Object.assign({}, state, {isFetching: true});
                break;

            // Send modified document to UI without access REST end-point
            case FV_PICTURES_SHARED_FETCH_SUCCESS:
                return Object.assign({}, state, {response: action.documents, isFetching: false, success: true});
                break;

            // Send modified document to UI without access REST end-point
            case FV_PICTURES_SHARED_FETCH_ERROR:
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
    }, /*,
  computePicture(state = { pictures: {} }, action) {
    switch (action.type) {
      case FV_PICTURE_FETCH_START:
      case FV_PICTURE_UPDATE_START:
      case FV_PICTURE_UPDATE_START:

        action.pictures[action.pathOrId].isFetching = true;
        action.pictures[action.pathOrId].success = false;

        return Object.assign({}, state, { pictures: Object.assign(state.pictures, action.pictures) });
      break;

      // Send modified document to UI without access REST end-point
      case FV_PICTURE_FETCH_SUCCESS:
      case FV_PICTURE_UPDATE_SUCCESS:
        
        action.pictures[action.pathOrId].isFetching = false;
        action.pictures[action.pathOrId].success = true;

        return Object.assign({}, state, { pictures: Object.assign(state.pictures, action.pictures) });
      break;

      // Send modified document to UI without access REST end-point
      case FV_PICTURE_FETCH_ERROR:
      case FV_PICTURE_UPDATE_ERROR:

        action.pictures[action.pathOrId].isFetching = false;
        action.pictures[action.pathOrId].success = false;
        action.pictures[action.pathOrId].isError = true;
        action.pictures[action.pathOrId].error = action.error;

        return Object.assign({}, state, { pictures: Object.assign(state.pictures, action.pictures) });
      break;

      default: 
        return Object.assign({}, state);
      break;
    }
  },*/
    computePicture: computePictureFactory.computePicture,
    /*computeCreatePicture(state = { isFetching: false, response: {get: function() { return ''; }}, success: false }, action) {
      switch (action.type) {
        case FV_PICTURE_CREATE_START:
          return Object.assign({}, state, { isFetching: true, success: false });
        break;

        // Send modified document to UI without access REST end-point
        case FV_PICTURE_CREATE_SUCCESS:
          return Object.assign({}, state, { response: action.document, isFetching: false, success: true });
        break;

        // Send modified document to UI without access REST end-point
        case FV_PICTURE_CREATE_ERROR:
          return Object.assign({}, state, { isFetching: false, isError: true, error: action.error, errorDismissed: (action.type === DISMISS_ERROR) ? true: false });
        break;

        default:
          return Object.assign({}, state, { isFetching: false });
        break;
      }
    },*/
    computePictureStats(state = {
        isFetching: false, response: {
            get: function () {
                return '';
            }
        }, success: false
    }, action) {
        switch (action.type) {
            case FV_PICTURE_FETCH_STATS_START:
                return Object.assign({}, state, {isFetching: true, success: false});
                break;

            case FV_PICTURE_FETCH_STATS_SUCCESS:
                return Object.assign({}, state, {response: action.document, isFetching: false, success: true});
                break;

            case FV_PICTURE_FETCH_STATS_ERROR:
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