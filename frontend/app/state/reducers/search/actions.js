import { query } from 'reducers/rest'
import DocumentOperations from 'operations/DocumentOperations'
import { QUERY_SEARCH_RESULTS_START, QUERY_SEARCH_RESULTS_SUCCESS, QUERY_SEARCH_RESULTS_ERROR } from './actionTypes'

export const querySearchResults = (queryParam, queryPath, docTypes, page, pageSize) => {
  return (dispatch) => {
    dispatch({ type: QUERY_SEARCH_RESULTS_START })

    return DocumentOperations.searchDocuments(
      queryParam,
      queryPath,
      docTypes,
      { properties: 'fvcore' },
      { currentPageIndex: page, pageSize: pageSize }
    )
      .then((response) => {
        dispatch({ type: QUERY_SEARCH_RESULTS_SUCCESS, documents: response })
      })
      .catch((error) => {
        dispatch({ type: QUERY_SEARCH_RESULTS_ERROR, error: error })
      })
  }
}

export const searchDocuments = query('FV_SEARCH_DOCUMENTS', 'Document', {
  headers: {
    'enrichers.document': 'ancestry, word, phrase',
    properties: 'dublincore, fvbook, fv-word, fvcore, fv-phrase, fv-portal',
  },
})
