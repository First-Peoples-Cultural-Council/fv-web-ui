import DocumentOperations from 'operations/DocumentOperations'
import DirectoryOperations from 'operations/DirectoryOperations'
import { create, fetch } from 'reducers/rest'

import {
  FV_PICTURES_SHARED_FETCH_START,
  FV_PICTURES_SHARED_FETCH_SUCCESS,
  FV_PICTURES_SHARED_FETCH_ERROR,
  FV_PICTURE_FETCH_STATS_START,
  FV_PICTURE_FETCH_STATS_SUCCESS,
  FV_PICTURE_FETCH_STATS_ERROR,
  FV_PICTURE_UPDATE_START,
  FV_PICTURE_UPDATE_SUCCESS,
  FV_PICTURE_UPDATE_ERROR,
} from './actionTypes'

/*
export const createPicture = function createPicture(parentDoc, docParams, file) {
  return (dispatch) => {

    dispatch( { type: FV_PICTURE_CREATE_START, document: docParams } );

    return DocumentOperations.createDocumentWithBlob(parentDoc, docParams, file)
      .then((response) => {
        dispatch( { type: FV_PICTURE_CREATE_SUCCESS, document: response} );
      }).catch((error) => {
          dispatch( { type: FV_PICTURE_CREATE_ERROR, error: error } )
    });
  }
};*/

export const updatePicture = function updatePicture(newDoc /*, field*/) {
  return (dispatch) => {
    const pictures = {}
    pictures[newDoc.id] = {}

    dispatch({ type: FV_PICTURE_UPDATE_START, pictures: pictures, pathOrId: newDoc.id })

    return DocumentOperations.updateDocument(newDoc)
      .then((response) => {
        pictures[newDoc.id] = { response: response }

        dispatch({ type: FV_PICTURE_UPDATE_SUCCESS, pictures: pictures, pathOrId: newDoc.id })
      })
      .catch((error) => {
        pictures[newDoc.id] = { error: error }

        dispatch({ type: FV_PICTURE_UPDATE_ERROR, pictures: pictures, pathOrId: newDoc.id })
      })
  }
}

export const fetchSharedPictures = function fetchSharedPictures(pageProvider, headers = {}, params = {}) {
  return (dispatch) => {
    dispatch({ type: FV_PICTURES_SHARED_FETCH_START })

    return DirectoryOperations.getDocumentsViaPageProvider(pageProvider, 'FVPicture', headers, params)
      .then((response) => {
        dispatch({ type: FV_PICTURES_SHARED_FETCH_SUCCESS, documents: response })
      })
      .catch((error) => {
        dispatch({ type: FV_PICTURES_SHARED_FETCH_ERROR, error: error })
      })
  }
}

/*
const fetchPictureAndStats = function fetchPictureWithStats(path) {
	  return dispatch => Promise.all([
	    dispatch(fetchPicture(path)),
        dispatch(fetchPictureStats())
      ]);
}

export const fetchPicture = function fetchPicture(pathOrId) {
  return (dispatch) => {

    let pictures = {};
    pictures[pathOrId] = {};

    dispatch( { type: FV_PICTURE_FETCH_START, pictures: pictures, pathOrId: pathOrId } );

    return DocumentOperations.getDocument(pathOrId, 'FVPicture', { headers: { 'enrichers.document': 'ancestry' } })
    .then((response) => {

      pictures[pathOrId] = { response: response };

      dispatch( { type: FV_PICTURE_FETCH_SUCCESS, pictures: pictures, pathOrId: pathOrId } )
    }).catch((error) => {

        pictures[pathOrId] = { error: error };

        dispatch( { type: FV_PICTURE_FETCH_ERROR, pictures: pictures, pathOrId: pathOrId } )
    });
  }
};*/

export const fetchPictureStats = function fetchPictureStats(dialectId) {
  return (dispatch) => {
    dispatch({ type: FV_PICTURE_FETCH_STATS_START })

    return DocumentOperations.getPictureStats(dialectId)
      .then((response) => {
        dispatch({ type: FV_PICTURE_FETCH_STATS_SUCCESS, document: response })
      })
      .catch((error) => {
        dispatch({ type: FV_PICTURE_FETCH_STATS_ERROR, error: error })
      })
  }
}

export const fetchPicture = fetch('FV_PICTURE', 'FVPicture', {
  headers: { 'enrichers.document': 'ancestry, media' },
})

export const createPicture = create('FV_PICTURE', 'FVPicture')
