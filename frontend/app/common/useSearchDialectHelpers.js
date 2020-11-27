import StringHelpers, { CLEAN_NXQL } from 'common/StringHelpers'
import {
  SEARCH_PART_OF_SPEECH_ANY,
  SEARCH_FILTERED_BY_CATEGORY,
  SEARCH_FILTERED_BY_PHRASE_BOOK,
  SEARCH_TYPE_DEFAULT_SEARCH,
  SEARCH_TYPE_APPROXIMATE_SEARCH,
  SEARCH_TYPE_EXACT_SEARCH,
  SEARCH_TYPE_CONTAINS_SEARCH,
  SEARCH_TYPE_STARTS_WITH_SEARCH,
  SEARCH_TYPE_ENDS_WITH_SEARCH,
  SEARCH_TYPE_WILDCARD_SEARCH,
} from 'common/Constants'

function useSearchDialectHelpers() {
  const switchSearchModes = ({ field, value, type }) => {
    const fuzzySearchDefault = `/*+ES: OPERATOR(fuzzy) */ ${field} ILIKE '${value}'`

    switch (type) {
      // Will return a result that is close (based on Levenstien distance) to the search term
      case SEARCH_TYPE_DEFAULT_SEARCH:
      case SEARCH_TYPE_APPROXIMATE_SEARCH:
        return fuzzySearchDefault

      // Will return an exact match to the word giving no leniency to unicode difference (i.e. chars that look similar but ARE different unicode)
      case SEARCH_TYPE_EXACT_SEARCH:
        return `${field} LIKE '${value}'`

      // Will return results where search term is contained in text
      case SEARCH_TYPE_CONTAINS_SEARCH:
        return `( /*+ES: OPERATOR(wildcard) */ ${field} ILIKE '*${value}*' )`

      // Will return results starting with search term
      case SEARCH_TYPE_STARTS_WITH_SEARCH:
        return `( /*+ES: OPERATOR(wildcard) */ ${field} ILIKE '${value}*' )`

      // Will return results ending with search term
      case SEARCH_TYPE_ENDS_WITH_SEARCH:
        return `( /*+ES: OPERATOR(wildcard) */ ${field} ILIKE '*${value}' )`

      // Allows the use of * or ? in queries for advanced users
      case SEARCH_TYPE_WILDCARD_SEARCH:
        return `( /*+ES: OPERATOR(wildcard) */ ${field} ILIKE '${value}' )`

      // Use fuzzy search matching as default
      default:
        return fuzzySearchDefault
    }
  }
  const generateNxql = ({
    searchByCulturalNotes,
    searchByDefinitions,
    searchByTitle,
    searchByTranslations,
    searchFilteredBy,
    searchPartOfSpeech,
    searchStyle,
    searchTerm,
  } = {}) => {
    let searchValue = StringHelpers.clean(searchTerm, CLEAN_NXQL) || ''
    searchValue = searchValue.trim()

    const nxqlTmpl = {
      // Use full text seach on dictionary for broad matches;
      // And approximate search as a fall back for close matches
      allFields:
        `ecm:fulltext_dictionary_all_field = '${searchValue}' OR ` +
        `${switchSearchModes({
          field: 'fv:definitions/*/translation',
          value: searchValue,
          type: searchStyle,
        })} OR ` +
        `${switchSearchModes({
          field: 'dc:title',
          value: searchValue,
          type: searchStyle,
        })}`,
      searchByTitle: switchSearchModes({
        field: 'dc:title',
        value: searchValue,
        type: searchStyle,
      }),
      searchByAlphabet: '',
      searchByCategory: `dc:title ILIKE '%${searchValue}%'`,
      searchByPhraseBook: `dc:title ILIKE '%${searchValue}%'`,
      searchByCulturalNotes: `fv:cultural_note ILIKE '%${searchValue}%'`,
      searchByDefinitions: switchSearchModes({
        field: 'fv:definitions/*/translation',
        value: searchValue,
        type: searchStyle,
      }),
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

    switch (searchFilteredBy) {
      case SEARCH_FILTERED_BY_CATEGORY: {
        nxqlQueries.push(`${nxqlTmpl.searchByCategory}`)
        break
      }
      case SEARCH_FILTERED_BY_PHRASE_BOOK: {
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
  return {
    generateNxql,
  }
}

export default useSearchDialectHelpers
