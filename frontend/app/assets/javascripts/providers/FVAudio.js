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
 * Multiple Audio Actions
 */
const FV_AUDIOS_FETCH_START = "FV_AUDIOS_FETCH_START";
const FV_AUDIOS_FETCH_SUCCESS = "FV_AUDIOS_FETCH_SUCCESS";
const FV_AUDIOS_FETCH_ERROR = "FV_AUDIOS_FETCH_ERROR";

const FV_AUDIOS_UPDATE_START = "FV_AUDIOS_UPDATE_START";
const FV_AUDIOS_UPDATE_SUCCESS = "FV_AUDIOS_UPDATE_SUCCESS";
const FV_AUDIOS_UPDATE_ERROR = "FV_AUDIOS_UPDATE_ERROR";

const FV_AUDIOS_CREATE_START = "FV_AUDIOS_CREATE_START";
const FV_AUDIOS_CREATE_SUCCESS = "FV_AUDIOS_CREATE_SUCCESS";
const FV_AUDIOS_CREATE_ERROR = "FV_AUDIOS_CREATE_ERROR";

const FV_AUDIOS_DELETE_START = "FV_AUDIOS_DELETE_START";
const FV_AUDIOS_DELETE_SUCCESS = "FV_AUDIOS_DELETE_SUCCESS";
const FV_AUDIOS_DELETE_ERROR = "FV_AUDIOS_DELETE_ERROR";

const FV_AUDIOS_SHARED_FETCH_START = "FV_AUDIOS_SHARED_FETCH_START";
const FV_AUDIOS_SHARED_FETCH_SUCCESS = "FV_AUDIOS_SHARED_FETCH_SUCCESS";
const FV_AUDIOS_SHARED_FETCH_ERROR = "FV_AUDIOS_SHARED_FETCH_ERROR";

/**
 * Single Audio Actions
 */
const FV_AUDIO_FETCH_START = "FV_AUDIO_FETCH_START";
const FV_AUDIO_FETCH_SUCCESS = "FV_AUDIO_FETCH_SUCCESS";
const FV_AUDIO_FETCH_ERROR = "FV_AUDIO_FETCH_ERROR";

const FV_AUDIO_FETCH_STATS_START = "FV_AUDIO_FETCH_STATS_START";
const FV_AUDIO_FETCH_STATS_SUCCESS = "FV_AUDIO_FETCH_STATS_SUCCESS";
const FV_AUDIO_FETCH_STATS_ERROR = "FV_AUDIO_FETCH_STATS_ERROR";

const FV_AUDIO_UPLOAD_START = "FV_AUDIO_UPLOAD_START";
const FV_AUDIO_UPLOAD_SUCCESS = "FV_AUDIO_UPLOAD_SUCCESS";
const FV_AUDIO_UPLOAD_ERROR = "FV_AUDIO_UPLOAD_ERROR";

const FV_AUDIO_UPDATE_START = "FV_AUDIO_UPDATE_START";
const FV_AUDIO_UPDATE_SUCCESS = "FV_AUDIO_UPDATE_SUCCESS";
const FV_AUDIO_UPDATE_ERROR = "FV_AUDIO_UPDATE_ERROR";

const FV_AUDIO_CREATE_START = "FV_AUDIO_CREATE_START";
const FV_AUDIO_CREATE_SUCCESS = "FV_AUDIO_CREATE_SUCCESS";
const FV_AUDIO_CREATE_ERROR = "FV_AUDIO_CREATE_ERROR";

const FV_AUDIO_DELETE_START = "FV_AUDIO_DELETE_START";
const FV_AUDIO_DELETE_SUCCESS = "FV_AUDIO_DELETE_SUCCESS";
const FV_AUDIO_DELETE_ERROR = "FV_AUDIO_DELETE_ERROR";

/*const createAudio = function createAudio(parentDoc, docParams, file) {
  return function (dispatch) {

    dispatch( { type: FV_AUDIO_CREATE_START, document: docParams } );

    return DocumentOperations.createDocumentWithBlob(parentDoc, docParams, file)
      .then((response) => {
        dispatch( { type: FV_AUDIO_CREATE_SUCCESS, document: response} );
      }).catch((error) => {
          dispatch( { type: FV_AUDIO_CREATE_ERROR, error: error } )
    });
  }
};*/

const updateAudio = function updateAudio(newDoc, field) {
    return function (dispatch) {

        let audios = {};
        audios[newDoc.id] = {};

        dispatch({type: FV_AUDIO_UPDATE_START, audios: audios, pathOrId: newDoc.id});

        return DocumentOperations.updateDocument(newDoc)
            .then((response) => {

                audios[newDoc.id] = {response: response};

                dispatch({type: FV_AUDIO_UPDATE_SUCCESS, audios: audios, pathOrId: newDoc.id});
            }).catch((error) => {

                audios[newDoc.id] = {error: error};

                dispatch({type: FV_AUDIO_UPDATE_ERROR, audios: audios, pathOrId: newDoc.id})
            });
    }
};

const fetchSharedAudios = function fetchSharedAudios(page_provider, headers = {}, params = {}) {
    return function (dispatch) {

        dispatch({type: FV_AUDIOS_SHARED_FETCH_START});

        return DirectoryOperations.getDocumentsViaPageProvider(page_provider, 'FVAudio', headers, params)
            .then((response) => {
                dispatch({type: FV_AUDIOS_SHARED_FETCH_SUCCESS, documents: response})
            }).catch((error) => {
                dispatch({type: FV_AUDIOS_SHARED_FETCH_ERROR, error: error})
            });
    }
};

/*cosnt fetchAudioAndStats = function fetchAudioWithStats(path) {
	  return dispatch => Promise.all([
	    dispatch(fetchAudio(path)),
        dispatch(fetchAudioStats())
      ]);
}*/

/*const fetchAudio = function fetchAudio(pathOrId) {
  return function (dispatch) {

    let audios = {};
    audios[pathOrId] = {};

    dispatch( { type: FV_AUDIO_FETCH_START, audios: audios, pathOrId: pathOrId } );

    return DocumentOperations.getDocument(pathOrId, 'FVAudio', { headers: { 'X-NXenrichers.document': 'ancestry' } })
    .then((response) => {

      audios[pathOrId] = { response: response };

      dispatch( { type: FV_AUDIO_FETCH_SUCCESS, audios: audios, pathOrId: pathOrId } )
    }).catch((error) => {

        audios[pathOrId] = { error: error };

        dispatch( { type: FV_AUDIO_FETCH_ERROR, audios: audios, pathOrId: pathOrId } )
    });
  }
};*/

const fetchAudioStats = function fetchAudioStats(dialectId) {
    return function (dispatch) {

        dispatch({type: FV_AUDIO_FETCH_STATS_START});

        return DocumentOperations.getAudioStats(dialectId)
            .then((response) => {
                dispatch({type: FV_AUDIO_FETCH_STATS_SUCCESS, document: response})
            }).catch((error) => {
                dispatch({type: FV_AUDIO_FETCH_STATS_ERROR, error: error})
            });
    }
};

const fetchAudio = RESTActions.fetch('FV_AUDIO', 'FVAudio', {headers: {'X-NXenrichers.document': 'ancestry, media'}});
const createAudio = RESTActions.create('FV_AUDIO', 'FVAudio');

const actions = {fetchSharedAudios, createAudio, fetchAudio, updateAudio, fetchAudioStats};

const computeAudioFactory = RESTReducers.computeFetch('audio');

const reducers = {
    computeSharedAudios(state = {
        isFetching: false, response: {
            get: function () {
                return '';
            }
        }, success: false
    }, action) {
        switch (action.type) {
            case FV_AUDIOS_SHARED_FETCH_START:
                return Object.assign({}, state, {isFetching: true});
                break;

            // Send modified document to UI without access REST end-point
            case FV_AUDIOS_SHARED_FETCH_SUCCESS:
                return Object.assign({}, state, {response: action.documents, isFetching: false, success: true});
                break;

            // Send modified document to UI without access REST end-point
            case FV_AUDIOS_SHARED_FETCH_ERROR:
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
    }/*,
  computeAudio(state = { audios: {} }, action) {
    switch (action.type) {
      case FV_AUDIO_FETCH_START:
      case FV_AUDIO_UPDATE_START:

        action.audios[action.pathOrId].isFetching = true;
        action.audios[action.pathOrId].success = false;

        return Object.assign({}, state, { audios: Object.assign(state.audios, action.audios) });
      break;

      // Send modified document to UI without access REST end-point
      case FV_AUDIO_FETCH_SUCCESS:
      case FV_AUDIO_UPDATE_SUCCESS:
        
        action.audios[action.pathOrId].isFetching = false;
        action.audios[action.pathOrId].success = true;

        return Object.assign({}, state, { audios: Object.assign(state.audios, action.audios) });
      break;

      // Send modified document to UI without access REST end-point
      case FV_AUDIO_FETCH_ERROR:
      case FV_AUDIO_UPDATE_ERROR:

        action.audios[action.pathOrId].isFetching = false;
        action.audios[action.pathOrId].success = false;
        action.audios[action.pathOrId].isError = true;
        action.audios[action.pathOrId].error = action.error;

        return Object.assign({}, state, { audios: Object.assign(state.audios, action.audios) });
      break;

      default: 
        return Object.assign({}, state);
      break;
    }
  },
  computeCreateAudio(state = { isFetching: false, response: {get: function() { return ''; }}, success: false }, action) {
    switch (action.type) {
      case FV_AUDIO_CREATE_START:
        return Object.assign({}, state, { isFetching: true, success: false });
      break;

      // Send modified document to UI without access REST end-point
      case FV_AUDIO_CREATE_SUCCESS:
        return Object.assign({}, state, { response: action.document, isFetching: false, success: true });
      break;

      // Send modified document to UI without access REST end-point
      case FV_AUDIO_CREATE_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error, errorDismissed: (action.type === DISMISS_ERROR) ? true: false });
      break;

      default: 
        return Object.assign({}, state, { isFetching: false });
      break;
    }
  }*/,
    computeAudio: computeAudioFactory.computeAudio,
    computeAudioStats(state = {
        isFetching: false, response: {
            get: function () {
                return '';
            }
        }, success: false
    }, action) {
        switch (action.type) {
            case FV_AUDIO_FETCH_STATS_START:
                return Object.assign({}, state, {isFetching: true, success: false});
                break;

            case FV_AUDIO_FETCH_STATS_SUCCESS:
                return Object.assign({}, state, {response: action.document, isFetching: false, success: true});
                break;

            case FV_AUDIO_FETCH_STATS_ERROR:
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