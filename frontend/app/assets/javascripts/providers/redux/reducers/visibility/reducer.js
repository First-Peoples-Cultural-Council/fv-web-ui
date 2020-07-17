import { computeOperation } from 'providers/redux/reducers/rest'
import { combineReducers } from 'redux'

const computeUpdateVisibilityOperation = computeOperation('update_visibility')

export const visibilityReducer = combineReducers({
  computeUpdateVisibility: computeUpdateVisibilityOperation.computeUpdateVisibility,
})
