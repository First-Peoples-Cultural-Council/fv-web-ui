import { create, fetch } from 'reducers/rest'
import DocumentOperations from 'operations/DocumentOperations'
import DirectoryOperations from 'operations/DirectoryOperations'

import {
  FV_VIDEOS_SHARED_FETCH_START,
  FV_VIDEOS_SHARED_FETCH_SUCCESS,
  FV_VIDEOS_SHARED_FETCH_ERROR,
  FV_VIDEO_UPDATE_START,
  FV_VIDEO_UPDATE_SUCCESS,
  FV_VIDEO_UPDATE_ERROR,
} from './actionTypes'

/*
export const createVideo = function createVideo(parentDoc, docParams, file) {
  return (dispatch) => {

    dispatch( { type: FV_VIDEO_CREATE_START, document: docParams } );

    return DocumentOperations.createDocumentWithBlob(parentDoc, docParams, file)
      .then((response) => {
        dispatch( { type: FV_VIDEO_CREATE_SUCCESS, document: response} );
      }).catch((error) => {
          dispatch( { type: FV_VIDEO_CREATE_ERROR, error: error } )
    });
  }
};*/

export const updateVideo = function _updateVideo(newDoc /*, field*/) {
  return (dispatch) => {
    const videos = {}
    videos[newDoc.id] = {}

    dispatch({ type: FV_VIDEO_UPDATE_START, videos: videos, pathOrId: newDoc.id })

    return DocumentOperations.updateDocument(newDoc)
      .then((response) => {
        videos[newDoc.id] = { response: response }

        dispatch({ type: FV_VIDEO_UPDATE_SUCCESS, videos: videos, pathOrId: newDoc.id })
      })
      .catch((error) => {
        videos[newDoc.id] = { error: error }

        dispatch({ type: FV_VIDEO_UPDATE_ERROR, videos: videos, pathOrId: newDoc.id })
      })
  }
}

export const fetchSharedVideos = function _fetchSharedVideos(pageProvider, headers = {}, params = {}) {
  return (dispatch) => {
    dispatch({ type: FV_VIDEOS_SHARED_FETCH_START })

    return DirectoryOperations.getDocumentsViaPageProvider(pageProvider, 'FVVideo', headers, params)
      .then((response) => {
        dispatch({ type: FV_VIDEOS_SHARED_FETCH_SUCCESS, documents: response })
      })
      .catch((error) => {
        dispatch({ type: FV_VIDEOS_SHARED_FETCH_ERROR, error: error })
      })
  }
}

export const fetchVideo = fetch('FV_VIDEO', 'FVVideo', {
  headers: { 'enrichers.document': 'ancestry, media' },
})

export const createVideo = create('FV_VIDEO', 'FVVideo')
