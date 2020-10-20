import { computeFetch, computeQuery } from 'providers/redux/reducers/rest'
import { combineReducers } from 'redux'

const computeLanguageFetch = computeFetch('language')
const computeLanguageQuery = computeQuery('languages')

export const fvLanguageReducer = combineReducers({
  computeLanguages: computeLanguageQuery.computeLanguages,
  computeLanguage: computeLanguageFetch.computeLanguage,
})
