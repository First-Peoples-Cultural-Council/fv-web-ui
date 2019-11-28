import { combineReducers } from 'redux'
import { SEARCH_DIALECT_UPDATE } from './actionTypes'
import { SEARCH_PART_OF_SPEECH_ANY, SEARCH_BY_DEFAULT } from 'views/components/SearchDialect/constants'
const initialState = {
  searchByAlphabet: '',
  searchByCulturalNotes: false,
  searchByDefinitions: true,
  searchByMode: SEARCH_BY_DEFAULT,
  searchByTitle: true,
  searchByTranslations: false,
  searchMessage: null,
  searchNxqlQuery: undefined,
  searchNxqlSort: {},
  searchPartOfSpeech: SEARCH_PART_OF_SPEECH_ANY,
  searchTerm: undefined,
  searchQueryDecoder: {
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
        urlParamActive.push(newState.searchQueryDecoder.searchByCulturalNotes)
      }

      if (searchByDefinitions) {
        urlParamActive.push(newState.searchQueryDecoder.searchByDefinitions)
      }

      if (searchByMode !== undefined) {
        // urlParam.push(`searchByMode=${searchByMode}`)
        urlParam.push('searchByMode=')
      }

      if (searchByTitle) {
        urlParamActive.push(newState.searchQueryDecoder.searchByTitle)
      }

      if (searchByTranslations) {
        urlParamActive.push(newState.searchQueryDecoder.searchByTranslations)
      }

      if (searchNxqlSort !== undefined) {
        // urlParam.push(`searchNxqlSort=${searchNxqlSort}`)
        urlParam.push('searchNxqlSort=')
      }

      if (searchPartOfSpeech !== undefined) {
        urlParam.push(`${newState.searchQueryDecoder.searchPartOfSpeech}=${searchPartOfSpeech}`)
      }

      if (searchTerm !== undefined) {
        urlParam.push(`${newState.searchQueryDecoder.searchTerm}=${searchTerm}`)
      }

      if (urlParamActive.length !== 0) {
        urlParam.push(`active=${urlParamActive.join(',')}`)
      }

      newState.searchUrlParam = urlParam.join('&')
      return newState
    }

    default:
      return state
  }
}

export const searchDialectReducer = combineReducers({
  computeSearchDialect,
})
