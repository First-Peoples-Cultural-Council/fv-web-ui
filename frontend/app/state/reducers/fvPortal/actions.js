import DirectoryOperations from 'operations/DirectoryOperations'
import { fetch, update } from 'reducers/rest'

import { FV_FETCH_PORTALS_FETCH_ERROR, FV_FETCH_PORTALS_FETCH_SUCCESS, FV_FETCH_PORTALS_START } from './actionTypes'

export const updatePortal = update('FV_PORTAL', 'FVPortal', {
  headers: { 'enrichers.document': 'ancestry,portal' },
})
export const fetchPortal = fetch('FV_PORTAL', 'FVPortal', {
  headers: { 'enrichers.document': 'ancestry,portal' },
})

export const fetchPortals = function fetchPortals(params) {
  return (dispatch) => {
    dispatch({ type: FV_FETCH_PORTALS_START })
    return DirectoryOperations.getDocumentsViaCustomAPI(`/site/${params.area}`)
      .then((response) => {
        dispatch({ type: FV_FETCH_PORTALS_FETCH_SUCCESS, documents: response })
      })
      .catch((error) => {
        dispatch({ type: FV_FETCH_PORTALS_FETCH_ERROR, error: error })
      })
  }
}
