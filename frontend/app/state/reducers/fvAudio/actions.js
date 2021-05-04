import { fetch, create } from 'reducers/rest'
import DirectoryOperations from 'operations/DirectoryOperations'
import DocumentOperations from 'operations/DocumentOperations'

import {
  FV_AUDIOS_SHARED_FETCH_START,
  FV_AUDIOS_SHARED_FETCH_SUCCESS,
  FV_AUDIOS_SHARED_FETCH_ERROR,
  FV_AUDIO_UPDATE_START,
  FV_AUDIO_UPDATE_SUCCESS,
  FV_AUDIO_UPDATE_ERROR,
} from './actionTypes'

/*
export const createAudio = (parentDoc, docParams, file) => {
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

export const updateAudio = (newDoc /*, field*/) => {
  return (dispatch) => {
    const audios = {}
    audios[newDoc.id] = {}

    dispatch({ type: FV_AUDIO_UPDATE_START, audios: audios, pathOrId: newDoc.id })

    return DocumentOperations.updateDocument(newDoc)
      .then((response) => {
        audios[newDoc.id] = { response: response }

        dispatch({ type: FV_AUDIO_UPDATE_SUCCESS, audios: audios, pathOrId: newDoc.id })
      })
      .catch((error) => {
        audios[newDoc.id] = { error: error }

        dispatch({ type: FV_AUDIO_UPDATE_ERROR, audios: audios, pathOrId: newDoc.id })
      })
  }
}

export const fetchSharedAudios = (pageProvider, headers = {}, params = {}) => {
  return (dispatch) => {
    dispatch({ type: FV_AUDIOS_SHARED_FETCH_START })

    return DirectoryOperations.getDocumentsViaPageProvider(pageProvider, 'FVAudio', headers, params)
      .then((response) => {
        dispatch({ type: FV_AUDIOS_SHARED_FETCH_SUCCESS, documents: response })
      })
      .catch((error) => {
        dispatch({ type: FV_AUDIOS_SHARED_FETCH_ERROR, error: error })
      })
  }
}

export const fetchAudio = fetch('FV_AUDIO', 'FVAudio', {
  headers: { 'enrichers.document': 'ancestry, media' },
})
export const createAudio = create('FV_AUDIO', 'FVAudio')
