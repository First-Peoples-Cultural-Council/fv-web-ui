// TODO: stub to temporarily disable local caching while we get a site wide invalidation system running
import { combineReducers } from 'redux'
export const cacheReducer = combineReducers({
  updateCount() {
    return 0
  },
  computeCharacters() {
    return { meta: { reducer: 'computeCharacters' } }
  },
  computePortal() {
    return { meta: { reducer: 'computePortal' } }
  },
})
