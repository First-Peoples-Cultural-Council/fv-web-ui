import { combineReducers } from 'redux'
import StringHelpers, { CLEAN_NXQL } from 'common/StringHelpers'
import { SEARCH_DIALECT_UPDATE } from './actionTypes'
import {
  SEARCH_PART_OF_SPEECH_ANY,
  SEARCH_BY_DEFAULT,
  SEARCH_BY_ALPHABET,
  SEARCH_BY_CATEGORY,
  SEARCH_BY_PHRASE_BOOK,
} from 'views/components/SearchDialect/constants'

const initialState = {
  searchByAlphabet: '',
  searchByMode: SEARCH_BY_DEFAULT,
  searchBySettings: undefined,
  searchingDialectFilter: undefined,
  searchMessage: null,
  searchNxqlQuery: undefined,
  searchNxqlSort: {},
  searchPartOfSpeech: SEARCH_PART_OF_SPEECH_ANY, // <-- Should this be in here or SearchDialect
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
  searchTerm: undefined,
}

const generateNxql = ({
  searchByAlphabet: _searchByAlphabet,
  searchByMode: _searchByMode,
  searchBySettings: _searchBySettings = {},
  searchTerm: _searchTerm,
} = {}) => {
  const {
    searchByCulturalNotes,
    searchByDefinitions,
    searchByTitle,
    searchByTranslations,
    searchPartOfSpeech,
  } = _searchBySettings

  const searchValue = StringHelpers.clean(_searchTerm, CLEAN_NXQL) || ''
  const searchByAlphabetValue = StringHelpers.clean(_searchByAlphabet, CLEAN_NXQL) || ''
  const nxqlTmpl = {
    // allFields: `ecm:fulltext = '*${StringHelpers.clean(searchValue, CLEAN_FULLTEXT)}*'`,
    searchByTitle: `/*+ES: INDEX(dc:title.fulltext) OPERATOR(match_phrase_prefix) */ ecm:fulltext.dc:title ILIKE '%${searchValue}%'`,
    searchByAlphabet: `dc:title ILIKE '${searchByAlphabetValue}%'`,
    searchByCategory: `dc:title ILIKE '%${searchValue}%'`,
    searchByPhraseBook: `dc:title ILIKE '%${searchValue}%'`,
    searchByCulturalNotes: `fv:cultural_note ILIKE '%${searchValue}%'`,
    searchByDefinitions: `fv:definitions/*/translation ILIKE '%${searchValue}%'`,
    searchByTranslations: `fv:literal_translation/*/translation ILIKE '%${searchValue}%'`,
    searchPartOfSpeech: `fv-word:part_of_speech = '${searchPartOfSpeech}'`,
  }

  const nxqlQueries = []
  let nxqlQuerySpeech = ''
  const nxqlQueryJoin = (nxq, join = ' OR ') => {
    if (nxq.length >= 1) {
      nxq.push(join)
    }
  }

  switch (_searchByMode) {
    case SEARCH_BY_ALPHABET: {
      nxqlQueries.push(`${nxqlTmpl.searchByAlphabet}`)
      break
    }
    case SEARCH_BY_CATEGORY: {
      nxqlQueries.push(`${nxqlTmpl.searchByCategory}`)
      break
    }
    case SEARCH_BY_PHRASE_BOOK: {
      nxqlQueries.push(`${nxqlTmpl.searchByPhraseBook}`)
      break
    }
    default: {
      if (searchValue) {
        if (searchByCulturalNotes) {
          nxqlQueryJoin(nxqlQueries)
          nxqlQueries.push(nxqlTmpl.searchByCulturalNotes)
        }
        if (searchByTitle) {
          nxqlQueryJoin(nxqlQueries)
          nxqlQueries.push(nxqlTmpl.searchByTitle)
        }
        if (searchByTranslations) {
          nxqlQueryJoin(nxqlQueries)
          nxqlQueries.push(nxqlTmpl.searchByTranslations)
        }
        if (searchByDefinitions) {
          nxqlQueryJoin(nxqlQueries)
          nxqlQueries.push(nxqlTmpl.searchByDefinitions)
        }
      }
      if (searchPartOfSpeech && searchPartOfSpeech !== SEARCH_PART_OF_SPEECH_ANY) {
        nxqlQuerySpeech = `${nxqlQueries.length === 0 ? '' : ' AND '}${nxqlTmpl.searchPartOfSpeech}`
      }
    }
  }

  let nxqlQueryCollection = ''
  if (nxqlQueries.length > 0) {
    nxqlQueryCollection = `( ${nxqlQueries.join('')} )`
  }
  return `${nxqlQueryCollection}${nxqlQuerySpeech}`
}

const generateNxqlSearchSort = ({ searchBySettings: _searchBySettings = {}, searchTerm: _searchTerm } = {}) => {
  const {
    searchByCulturalNotes,
    searchByDefinitions,
    searchByTitle,
    searchByTranslations,
    searchPartOfSpeech,
  } = _searchBySettings

  // Default sort
  let searchSortBy = 'dc:title'

  // If only searching parts of speech
  if (
    searchByCulturalNotes === false &&
    searchByDefinitions === false &&
    searchByTitle === false &&
    searchByTranslations === false &&
    searchPartOfSpeech !== SEARCH_PART_OF_SPEECH_ANY
  ) {
    searchSortBy = 'fv-word:part_of_speech'
  }

  if (_searchTerm) {
    return {
      DEFAULT_SORT_COL: searchSortBy,
      DEFAULT_SORT_TYPE: 'asc',
    }
  }
  return {}
}

const computeSearchDialect = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_DIALECT_UPDATE: {
      // Update state
      // ------------------------------------------------------------
      const newState = Object.assign({}, state, action.payload || {})
      const { searchByAlphabet, searchByMode, searchBySettings = {}, searchNxqlSort, searchTerm } = newState

      // Generate NXQL related data
      // ------------------------------------------------------
      newState.searchNxqlQuery = generateNxql({
        searchByAlphabet,
        searchByMode,
        searchBySettings,
        searchTerm,
      })
      newState.searchNxqlSort = generateNxqlSearchSort({
        searchBySettings,
        searchTerm,
      })

      // Generate url search param
      // ------------------------------------------------------
      const {
        searchByCulturalNotes,
        searchByDefinitions,
        searchByTitle,
        searchByTranslations,
        searchPartOfSpeech,
      } = searchBySettings

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

      // Send out updated state
      // ------------------------------------------------------
      return newState
    }

    default:
      return state
  }
}

export const searchDialectReducer = combineReducers({
  computeSearchDialect,
})
