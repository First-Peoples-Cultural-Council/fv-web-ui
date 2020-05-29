import { combineReducers } from 'redux'
import StringHelpers, { CLEAN_NXQL } from 'common/StringHelpers'
import { SEARCH_DIALECT_UPDATE, SEARCH_DIALECT_RESET } from './actionTypes'
import {
  SEARCH_PART_OF_SPEECH_ANY,
  SEARCH_BY_DEFAULT,
  SEARCH_BY_CATEGORY,
  SEARCH_BY_PHRASE_BOOK,
  SEARCH_TYPE_DEFAULT_SEARCH,
  SEARCH_TYPE_APPROXIMATE_SEARCH,
  SEARCH_TYPE_EXACT_SEARCH,
  SEARCH_TYPE_CONTAINS_SEARCH,
  SEARCH_TYPE_STARTS_WITH_SEARCH,
  SEARCH_TYPE_ENDS_WITH_SEARCH,
  SEARCH_TYPE_WILDCARD_SEARCH,
} from 'views/components/SearchDialect/constants'

export const initialState = {
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

const switchSearchModes = (searchField, searchValue, searchType) => {
  const fuzzySearchDefault = `/*+ES: OPERATOR(fuzzy) */ ${searchField} ILIKE '${searchValue}'`

  switch (searchType) {
    // Will return a result that is close (based on Levenstien distance) to the search term
    case SEARCH_TYPE_DEFAULT_SEARCH:
    case SEARCH_TYPE_APPROXIMATE_SEARCH:
      return fuzzySearchDefault

    // Will return an exact match to the word giving no leniency to unicode difference (i.e. chars that look similar but ARE different unicode)
    case SEARCH_TYPE_EXACT_SEARCH:
      return `${searchField} LIKE '${searchValue}'`

    // Will return results where search term is contained in text
    case SEARCH_TYPE_CONTAINS_SEARCH:
      return `( /*+ES: OPERATOR(wildcard) */ ${searchField} ILIKE '*${searchValue}*' )`

    // Will return results starting with search term
    case SEARCH_TYPE_STARTS_WITH_SEARCH:
      return `( /*+ES: OPERATOR(wildcard) */ ${searchField} ILIKE '${searchValue}*' )`

    // Will return results ending with search term
    case SEARCH_TYPE_ENDS_WITH_SEARCH:
      return `( /*+ES: OPERATOR(wildcard) */ ${searchField} ILIKE '*${searchValue}' )`

    // Allows the use of * or ? in queries for advanced users
    case SEARCH_TYPE_WILDCARD_SEARCH:
      return `( /*+ES: OPERATOR(wildcard) */ ${searchField} ILIKE '${searchValue}' )`

    // Use fuzzy search matching as default
    default:
      return fuzzySearchDefault
  }
}

const generateNxql = ({
  searchByMode: _searchByMode,
  searchBySettings: _searchBySettings = {},
  searchTerm: _searchTerm,
  searchType: _searchType,
} = {}) => {
  const {
    searchByCulturalNotes,
    searchByDefinitions,
    searchByTitle,
    searchByTranslations,
    searchPartOfSpeech,
  } = _searchBySettings

  let searchValue = StringHelpers.clean(_searchTerm, CLEAN_NXQL) || ''
  searchValue = searchValue.trim()

  const nxqlTmpl = {
    // Use full text seach on dictionary for broad matches;
    // And approximate search as a fall back for close matches
    allFields:
      `ecm:fulltext_dictionary_all_field = '${searchValue}' OR ` +
      `${switchSearchModes('fv:definitions/*/translation', searchValue, _searchType)} OR ` +
      `${switchSearchModes('dc:title', searchValue, _searchType)}`,
    searchByTitle: switchSearchModes('dc:title', searchValue, _searchType),
    searchByAlphabet: '',
    searchByCategory: `dc:title ILIKE '%${searchValue}%'`,
    searchByPhraseBook: `dc:title ILIKE '%${searchValue}%'`,
    searchByCulturalNotes: `fv:cultural_note ILIKE '%${searchValue}%'`,
    searchByDefinitions: switchSearchModes('fv:definitions/*/translation', searchValue, _searchType),
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
        // Handle definitions and title together as a space case - full-text search on entire dictionary
        if (searchByDefinitions && searchByTitle) {
          nxqlQueryJoin(nxqlQueries)
          nxqlQueries.push(nxqlTmpl.allFields)
        } else {
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

const generateNxqlSearchSort = ({
  searchBySettings: _searchBySettings = {},
  searchTerm: _searchTerm,
  searchType: _searchType,
} = {}) => {
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
    let sortOrder

    switch (_searchType) {
      // Sort by score (i.e. return most relevant results)
      case SEARCH_TYPE_APPROXIMATE_SEARCH:
      case SEARCH_TYPE_DEFAULT_SEARCH:
        searchSortBy = 'ecm:fulltextScore'
        sortOrder = 'desc'
        break
      default:
        sortOrder = 'asc'
        break
    }

    return {
      DEFAULT_SORT_COL: searchSortBy,
      DEFAULT_SORT_TYPE: sortOrder,
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
      const { searchByAlphabet, searchByMode, searchBySettings = {}, searchNxqlSort, searchTerm, searchType } = newState

      // Generate NXQL related data
      // ------------------------------------------------------
      newState.searchNxqlQuery = generateNxql({
        searchByAlphabet,
        searchByMode,
        searchBySettings,
        searchTerm,
        searchType,
      })
      newState.searchNxqlSort = generateNxqlSearchSort({
        searchBySettings,
        searchTerm,
        searchType,
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

    case SEARCH_DIALECT_RESET: {
      return initialState
    }

    default: {
      return state
    }
  }
}

export const searchDialectReducer = combineReducers({
  computeSearchDialect,
})
