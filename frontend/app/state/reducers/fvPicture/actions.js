import DocumentOperations from 'operations/DocumentOperations'
import DirectoryOperations from 'operations/DirectoryOperations'
import { create, fetch } from 'reducers/rest'

import {
  FV_PICTURES_SHARED_FETCH_START,
  FV_PICTURES_SHARED_FETCH_SUCCESS,
  FV_PICTURES_SHARED_FETCH_ERROR,
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

export const fetchPicture = fetch('FV_PICTURE', 'FVPicture', {
  headers: { 'enrichers.document': 'ancestry, media' },
})

export const createPicture = create('FV_PICTURE', 'FVPicture')
