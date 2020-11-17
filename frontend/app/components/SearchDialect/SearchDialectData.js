import { useRef } from 'react'
import PropTypes from 'prop-types'
import { getFormData } from 'common/FormHelpers'
import {
  // SEARCH_PART_OF_SPEECH_ANY,
  // SEARCH_BY_ALPHABET,
  // SEARCH_BY_CATEGORY,
  // SEARCH_BY_CUSTOM,
  // SEARCH_BY_PHRASE_BOOK,
  // SEARCH_DATA_TYPE_PHRASE,
  // SEARCH_DATA_TYPE_WORD,
  SEARCH_TYPE_DEFAULT_SEARCH,
  // SEARCH_TYPE_APPROXIMATE_SEARCH,
  // SEARCH_TYPE_EXACT_SEARCH,
  // SEARCH_TYPE_CONTAINS_SEARCH,
  // SEARCH_TYPE_STARTS_WITH_SEARCH,
  // SEARCH_TYPE_ENDS_WITH_SEARCH,
  // SEARCH_TYPE_WILDCARD_SEARCH,
} from 'common/Constants'

import useIntl from 'dataSources/useIntl'
// import useDirectory from 'dataSources/useDirectory'
import useNavigationHelpers from 'common/useNavigationHelpers'

import { getDialectClassname } from 'common/Helpers'

/**
 * @summary SearchDialectData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function SearchDialectData({ children, incrementResetCount /*searchDialectDataType,*/ }) {
  const { intl } = useIntl()
  const formRefSearch = useRef(null)
  const { navigate, convertObjToUrlQuery, getSearchAsObject } = useNavigationHelpers()
  const {
    //   category: queryCategory,
    //   letter: queryLetter,
    //   page: queryPage,
    //   pageSize: queryPageSize,
    //   phraseBook: queryPhraseBook,
    //   sortBy: querySortBy,
    //   sortOrder: querySortOrder,
    searchStyle: querySearchStyle,
    //   searchQuery: queryQuery,
    searchTerm: querySearchTerm,
    //   ...searchRemainders
  } = getSearchAsObject({
    page: 1,
    pageSize: 10,
    searchStyle: SEARCH_TYPE_DEFAULT_SEARCH,
  })
  const dialectClassName = getDialectClassname()

  /*
  // Generates the 'You are searching ...' message
  // ------------------------------------------------------------
  const getSearchMessage = ({
    searchByAlphabet,
    searchByMode: _searchByMode,
    searchBySettings: _searchBySettings = {},
    searchTerm: _searchTerm,
    searchType: _searchType,
  }) => {
    const {
      searchPartOfSpeech,
      searchByTitle,
      searchByDefinitions,
      searchByCulturalNotes,
      searchByTranslations,
    } = _searchBySettings

    const cols = []
    if (searchByTitle) {
      switch (searchDialectDataType) {
        case SEARCH_DATA_TYPE_WORD:
          cols.push('Word')
          break
        case SEARCH_DATA_TYPE_PHRASE:
          cols.push('Phrase')
          break
        default:
          cols.push('Item')
      }
    }
    if (searchByDefinitions) {
      cols.push('Definitions')
    }
    if (searchByCulturalNotes) {
      cols.push('Cultural notes')
    }
    if (searchByTranslations) {
      cols.push('Literal translations')
    }

    let dataType
    switch (searchDialectDataType) {
      case SEARCH_DATA_TYPE_WORD:
        dataType = 'words'
        break
      case SEARCH_DATA_TYPE_PHRASE:
        dataType = 'phrases'
        break
      default:
        dataType = 'items'
    }

    let searchTypeLabel

    switch (_searchType) {
      case SEARCH_TYPE_DEFAULT_SEARCH:
        searchTypeLabel = ' match '
        break
      case SEARCH_TYPE_APPROXIMATE_SEARCH:
        searchTypeLabel = ' approximately match '
        break
      case SEARCH_TYPE_EXACT_SEARCH:
        searchTypeLabel = ' exactly match '
        break
      case SEARCH_TYPE_CONTAINS_SEARCH:
        searchTypeLabel = ' contain '
        break
      case SEARCH_TYPE_STARTS_WITH_SEARCH:
        searchTypeLabel = ' start with '
        break
      case SEARCH_TYPE_ENDS_WITH_SEARCH:
        searchTypeLabel = ' end with '
        break
      case SEARCH_TYPE_WILDCARD_SEARCH:
        searchTypeLabel = ' pattern match '
        break
      default:
        searchTypeLabel = ' contain '
    }

    const searchTermTag = <strong className={dialectClassName}>{_searchTerm}</strong>
    const searchTypeTag = <strong>{searchTypeLabel}</strong>
    const messagePartsOfSpeech =
      searchPartOfSpeech && searchPartOfSpeech !== SEARCH_PART_OF_SPEECH_ANY
        ? ", filtered by the selected 'Parts of speech'"
        : ''

    const messages = {
      // `all` is defined later
      byCategory: <span>{`Showing all ${dataType} in the selected category${messagePartsOfSpeech}`}</span>,
      byPhraseBook: <span>{`Showing all ${dataType} from the selected Phrase Book${messagePartsOfSpeech}`}</span>,
      startWith: (
        <span>
          {`Showing ${dataType} that start with the letter '`}
          <strong className={dialectClassName}>{searchByAlphabet}</strong>
          {`'${messagePartsOfSpeech}`}
        </span>
      ),
      contain: (
        <span>
          {`Showing ${dataType} that contain the search term '`}
          {searchTermTag}
          {`'${messagePartsOfSpeech}`}
        </span>
      ),
      containColOne: (
        <span>
          {`Showing ${dataType} that `}
          {searchTypeTag}
          {" the search term '"}
          {searchTermTag}
          {`' in the '${cols[0]}' column${messagePartsOfSpeech}`}
        </span>
      ),
      containColsTwo: (
        <span>
          {`Showing ${dataType} that `}
          {searchTypeTag}
          {" the search term '"}
          {searchTermTag}
          {`' in the '${cols[0]}' and '${cols[1]}' columns${messagePartsOfSpeech}`}
        </span>
      ),
      containColsThree: (
        <span>
          {`Showing ${dataType} that `}
          {searchTypeTag}
          {" the search term '"}
          {searchTermTag}
          {`' in the '${cols[0]}', '${cols[1]}', and '${cols[2]}' columns${messagePartsOfSpeech}`}
        </span>
      ),
    }

    switch (searchDialectDataType) {
      case SEARCH_DATA_TYPE_WORD:
        messages.all = (
          <span>{`Showing all ${dataType} in the dictionary listed alphabetically${messagePartsOfSpeech}`}</span>
        )
        break
      case SEARCH_DATA_TYPE_PHRASE:
        messages.all = <span>{`Showing all ${dataType} listed alphabetically${messagePartsOfSpeech}`}</span>
        break
      default:
        messages.all = <span>{`Showing all ${dataType} listed alphabetically${messagePartsOfSpeech}`}</span>
    }

    let msg = messages.all

    if (
      searchPartOfSpeech !== true &&
      searchByTitle !== true &&
      searchByDefinitions !== true &&
      searchByCulturalNotes !== true &&
      searchByTranslations !== true
    ) {
      return <div className={classNames('SearchDialectSearchFeedback', 'alert', 'alert-info')}>{msg}</div>
    }

    switch (_searchByMode) {
      case SEARCH_BY_ALPHABET: {
        msg = messages.startWith
        break
      }
      case SEARCH_BY_CATEGORY: {
        msg = messages.byCategory
        break
      }
      case SEARCH_BY_PHRASE_BOOK: {
        msg = messages.byPhraseBook
        break
      }
      case SEARCH_BY_CUSTOM: {
        if (!queryQuery || queryQuery === '') {
          msg = messages.all
        } else {
          msg = messages.contain

          if (cols.length === 1) {
            msg = messages.containColOne
          }

          if (cols.length === 2) {
            msg = messages.containColsTwo
          }

          if (cols.length >= 3) {
            msg = messages.containColsThree
          }
        }
        break
      }
      default: // NOTE: do nothing
    }
    return <div className={classNames('SearchDialectSearchFeedback', 'alert', 'alert-info')}>{msg}</div>
  }
  */

  // Search handler
  // ------------------------------------------------------------
  const onSearch = () => {
    const formData = getFormData({
      formReference: formRefSearch,
    })

    navigate(`${window.location.pathname}?${convertObjToUrlQuery(Object.assign({}, getSearchAsObject(), formData))}`)
  }

  // Handles search by enter key
  // ------------------------------------------------------------
  const onPressEnter = (evt) => {
    if (evt.key === 'Enter') {
      onSearch()
    }
  }

  // Resets search
  // ------------------------------------------------------------
  const onReset = () => {
    navigate(`${window.location.pathname}?page=1&pageSize=10`)
    incrementResetCount()
  }
  return children({
    dialectClassName,
    formRefSearch,
    intl,
    onPressEnter,
    onReset,
    onSearch,
    searchTerm: querySearchTerm,
    searchStyle: querySearchStyle,
  })
}
// PROPTYPES
const { func, number } = PropTypes
SearchDialectData.propTypes = {
  children: func,
  searchDialectDataType: number,
}

export default SearchDialectData
