import DocumentOperations from 'operations/DocumentOperations'

import {
  REPORT_DOCUMENTS_FETCH_START,
  REPORT_DOCUMENTS_FETCH_SUCCESS,
  REPORT_DOCUMENTS_FETCH_ERROR,
  REPORT_WORDS_ALL_FETCH_START,
  REPORT_WORDS_ALL_FETCH_SUCCESS,
  REPORT_WORDS_ALL_FETCH_ERROR,
  REPORT_PHRASES_ALL_FETCH_START,
  REPORT_PHRASES_ALL_FETCH_SUCCESS,
  REPORT_PHRASES_ALL_FETCH_ERROR,
  REPORT_SONGS_ALL_FETCH_START,
  REPORT_SONGS_ALL_FETCH_SUCCESS,
  REPORT_SONGS_ALL_FETCH_ERROR,
  REPORT_STORIES_ALL_FETCH_START,
  REPORT_STORIES_ALL_FETCH_SUCCESS,
  REPORT_STORIES_ALL_FETCH_ERROR,
} from './actionTypes'

export const fetchReportDocuments = (path, queryAppend, page, pageSize) => {
  return (dispatch) => {
    dispatch({ type: REPORT_DOCUMENTS_FETCH_START })

    return DocumentOperations.queryDocumentsByDialect(
      '/' + path,
      queryAppend,
      { properties: 'dublincore, fv-word, fvcore' },
      { currentPageIndex: page, pageSize: pageSize }
    )
      .then((response) => {
        dispatch({ type: REPORT_DOCUMENTS_FETCH_SUCCESS, documents: response })
      })
      .catch((error) => {
        dispatch({ type: REPORT_DOCUMENTS_FETCH_ERROR, error: error })
      })
  }
}

export const fetchReportWordsAll = (path) => {
  return (dispatch) => {
    dispatch({ type: REPORT_WORDS_ALL_FETCH_START })

    return DocumentOperations.queryDocumentsByDialect(
      '/' + path,
      " AND ecm:primaryType='FVWord'",
      { properties: 'dublincore, fv-word, fvcore' },
      { currentPageIndex: 0, pageSize: 10 }
    )
      .then((response) => {
        dispatch({ type: REPORT_WORDS_ALL_FETCH_SUCCESS, documents: response })
      })
      .catch((error) => {
        dispatch({ type: REPORT_WORDS_ALL_FETCH_ERROR, error: error })
      })
  }
}

export const fetchReportPhrasesAll = (path) => {
  return (dispatch) => {
    dispatch({ type: REPORT_PHRASES_ALL_FETCH_START })

    return DocumentOperations.queryDocumentsByDialect(
      '/' + path,
      " AND ecm:primaryType='FVPhrase'",
      { properties: 'dublincore, fv-phrase, fvcore' },
      { currentPageIndex: 0, pageSize: 10 }
    )
      .then((response) => {
        dispatch({ type: REPORT_PHRASES_ALL_FETCH_SUCCESS, documents: response })
      })
      .catch((error) => {
        dispatch({ type: REPORT_PHRASES_ALL_FETCH_ERROR, error: error })
      })
  }
}

export const fetchReportSongsAll = (path) => {
  return (dispatch) => {
    dispatch({ type: REPORT_SONGS_ALL_FETCH_START })

    return DocumentOperations.queryDocumentsByDialect(
      '/' + path,
      " AND ecm:primaryType='FVBook' AND fvbook:type='song'",
      { properties: 'dublincore, fvbook, fvcore' },
      { currentPageIndex: 0, pageSize: 10 }
    )
      .then((response) => {
        dispatch({ type: REPORT_SONGS_ALL_FETCH_SUCCESS, documents: response })
      })
      .catch((error) => {
        dispatch({ type: REPORT_SONGS_ALL_FETCH_ERROR, error: error })
      })
  }
}

export const fetchReportStoriesAll = (path) => {
  return (dispatch) => {
    dispatch({ type: REPORT_STORIES_ALL_FETCH_START })

    return DocumentOperations.queryDocumentsByDialect(
      '/' + path,
      " AND ecm:primaryType='FVBook' AND fvbook:type='story'",
      { properties: 'dublincore, fvbook, fvcore' },
      { currentPageIndex: 0, pageSize: 10 }
    )
      .then((response) => {
        dispatch({ type: REPORT_STORIES_ALL_FETCH_SUCCESS, documents: response })
      })
      .catch((error) => {
        dispatch({ type: REPORT_STORIES_ALL_FETCH_ERROR, error: error })
      })
  }
}
