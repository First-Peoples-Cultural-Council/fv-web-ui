import DirectoryOperations from 'operations/DirectoryOperations'
import { execute, fetch, update } from 'reducers/rest'

import { FV_FETCH_PORTALS_FETCH_ERROR, FV_FETCH_PORTALS_FETCH_SUCCESS, FV_FETCH_PORTALS_START } from './actionTypes'

export const updatePortal = update('FV_PORTAL', 'FVPortal', {
  headers: { 'enrichers.document': 'ancestry,portal' },
})
export const unpublishPortal = execute('FV_PORTAL_UNPUBLISH', 'FVUnpublishDialect', {
  headers: { 'enrichers.document': 'ancestry,portal' },
})
export const fetchPortal = fetch('FV_PORTAL', 'FVPortal', {
  headers: { 'enrichers.document': 'ancestry,portal' },
})
// export const fetchPortals = query("FV_PORTALS", "FVPortal", {
//   page_provider: "get_dialects",
//   headers: { "enrichers.document": "ancestry,portal", "properties": "" },
// })

export const fetchPortals = function fetchPortals(pageProvider, headers = {}, params = {}) {
  return (dispatch) => {
    dispatch({ type: FV_FETCH_PORTALS_START })

    return DirectoryOperations.getDocumentsViaPageProvider(pageProvider, 'FVPortal', headers, params)
      .then((response) => {
        dispatch({ type: FV_FETCH_PORTALS_FETCH_SUCCESS, documents: response })
      })
      .catch((error) => {
        dispatch({ type: FV_FETCH_PORTALS_FETCH_ERROR, error: error })
      })
  }
}

export const fetchPortalsFromCustomAPI = function fetchPortalsFromCustomAPI(params) {
  return (dispatch) => {
    dispatch({ type: FV_FETCH_PORTALS_START })
    return DirectoryOperations.getDocumentsViaCustomAPI(`/portal/${params.area}`)
      .then((response) => {
        dispatch({ type: FV_FETCH_PORTALS_FETCH_SUCCESS, documents: response })
      })
      .catch((error) => {
        dispatch({ type: FV_FETCH_PORTALS_FETCH_ERROR, error: error })
      })
  }
}
