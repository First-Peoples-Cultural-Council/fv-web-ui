import { computeQuery, computeDelete } from 'providers/redux/reducers/rest'
import { combineReducers } from 'redux'

const computePageQueryFactory = computeQuery('page')
const computePageDeleteFactory = computeDelete('delete_page')

export const fvPageReducer = combineReducers({
  computePage: computePageQueryFactory.computePage,
  computeDeletePage: computePageDeleteFactory.computeDeletePage,
})
