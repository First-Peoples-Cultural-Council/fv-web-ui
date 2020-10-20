import { computeFetch } from 'reducers/rest'
import { combineReducers } from 'redux'

const computeLanguageFamilyFetch = computeFetch('language_family')
export const fvLanguageFamilyReducer = combineReducers({
  computeLanguageFamily: computeLanguageFamilyFetch.computeLanguageFamily,
})
