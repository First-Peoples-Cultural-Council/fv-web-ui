import { combineReducers } from 'redux'
import { SEARCH_DIALECT_UPDATE } from './actionTypes'
import { SEARCH_SORT_DEFAULT, SEARCH_BY_DEFAULT } from 'views/components/SearchDialect/constants'
const initialState = {
  searchByAlphabet: '',
  searchByCulturalNotes: false,
  searchByDefinitions: true,
  searchByMode: SEARCH_BY_DEFAULT,
  searchByTitle: true,
  searchByTranslations: false,
  searchInfoOutput: null,
  searchNxqlQuery: undefined,
  searchNxqlSort: {},
  searchPartOfSpeech: SEARCH_SORT_DEFAULT,
  searchTerm: undefined,
  decoder: {
    cn: 'searchByCulturalNotes',
    searchByCulturalNotes: 'cn',
    d: 'searchByDefinitions',
    searchByDefinitions: 'd',
    ti: 'searchByTitle',
    searchByTitle: 'ti',
    tr: 'searchByTranslations',
    searchByTranslations: 'tr',
    q: 'searchTerm',
    searchTerm: 'q',
    pos: 'searchPartOfSpeech',
    searchPartOfSpeech: 'pos',
  },
}

const computeSearchDialect = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_DIALECT_UPDATE: {
      const newState = Object.assign({}, state, action.payload || {})

      const {
        searchByAlphabet,
        searchByCulturalNotes,
        searchByDefinitions,
        searchByMode,
        searchByTitle,
        searchByTranslations,
        searchNxqlSort,
        searchPartOfSpeech,
        searchTerm,
      } = newState
      const urlParam = []
      const urlParamActive = []

      if (searchByAlphabet !== undefined) {
        // urlParam.push(`searchByAlphabet=${searchByAlphabet}`)
        urlParam.push('searchByAlphabet=')
      }

      if (searchByCulturalNotes) {
        urlParamActive.push(newState.decoder.searchByCulturalNotes)
      }

      if (searchByDefinitions) {
        urlParamActive.push(newState.decoder.searchByDefinitions)
      }

      if (searchByMode !== undefined) {
        // urlParam.push(`searchByMode=${searchByMode}`)
        urlParam.push('searchByMode=')
      }

      if (searchByTitle) {
        urlParamActive.push(newState.decoder.searchByTitle)
      }

      if (searchByTranslations) {
        urlParamActive.push(newState.decoder.searchByTranslations)
      }

      if (searchNxqlSort !== undefined) {
        // urlParam.push(`searchNxqlSort=${searchNxqlSort}`)
        urlParam.push('searchNxqlSort=')
      }

      if (searchPartOfSpeech !== undefined) {
        urlParam.push(`${newState.decoder.searchPartOfSpeech}=${searchPartOfSpeech}`)
      }

      if (searchTerm !== undefined) {
        urlParam.push(`${newState.decoder.searchTerm}=${searchTerm}`)
      }

      if (urlParamActive.length !== 0) {
        urlParam.push(`active=${urlParamActive.join(',')}`)
      }

      newState.urlParam = urlParam.join('&')
      return newState
    }

    default:
      return state
  }
}

export const searchDialectReducer = combineReducers({
  computeSearchDialect,
})
