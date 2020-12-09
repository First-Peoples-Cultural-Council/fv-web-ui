import { combineReducers } from 'redux'

function updateCache({ action, actionType, state }) {
  if (action.type === actionType && action.pathOrId.toLowerCase().includes('/fv/sections')) {
    const newState = {
      ...state,
      [action.pathOrId]: action,
    }
    return newState
  }
  return state
}
const cacheList = {
  computeCharacters: 'FV_CHARACTERS_QUERY_SUCCESS',
  computePortal: 'FV_PORTAL_FETCH_SUCCESS',
}
const cacheActions = Object.values(cacheList)
export const cacheReducer = combineReducers({
  // Since we aren't triggering cache specific actions we rely on updateCount to decide what to save into local cache
  updateCount(state = 0, action) {
    if (cacheActions.includes(action.type) && action.pathOrId.toLowerCase().includes('/fv/sections')) {
      return state + 1
    }
    return state
  },
  computeCharacters(state = {}, action) {
    return updateCache({
      action,
      actionType: cacheList.computeCharacters,
      state,
    })
  },
  computePortal(state = {}, action) {
    return updateCache({
      action,
      actionType: cacheList.computePortal,
      state,
    })
  },
})
