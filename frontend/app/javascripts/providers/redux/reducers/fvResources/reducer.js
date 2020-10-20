import { computeFetch, computeQuery } from 'providers/redux/reducers/rest'
import { combineReducers } from 'redux'

const computeResourceFetchFactory = computeFetch('resource')
const computeResourcesQueryFactory = computeQuery('resources')

export const fvResourcesReducer = combineReducers({
  computeResource: computeResourceFetchFactory.computeResource,
  computeResources: computeResourcesQueryFactory.computeResources,
})
