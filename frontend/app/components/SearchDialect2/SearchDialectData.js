import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import selectn from 'selectn'

import {
  SEARCH_PART_OF_SPEECH_ANY,
  SEARCH_BY_ALPHABET,
  SEARCH_BY_CATEGORY,
  SEARCH_BY_CUSTOM,
  SEARCH_BY_PHRASE_BOOK,
  SEARCH_DATA_TYPE_PHRASE,
  SEARCH_DATA_TYPE_WORD,
  SEARCH_TYPE_DEFAULT_SEARCH,
  SEARCH_TYPE_APPROXIMATE_SEARCH,
  SEARCH_TYPE_EXACT_SEARCH,
  SEARCH_TYPE_CONTAINS_SEARCH,
  SEARCH_TYPE_STARTS_WITH_SEARCH,
  SEARCH_TYPE_ENDS_WITH_SEARCH,
  SEARCH_TYPE_WILDCARD_SEARCH,
} from 'common/Constants'

import useIntl from 'dataSources/useIntl'
import useRoute from 'dataSources/useRoute'
import useSearchDialect from 'dataSources/useSearchDialect'
import useDirectory from 'dataSources/useDirectory'

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
function SearchDialectData({ children, handleSearch, resetSearch, searchDialectDataType, searchUi }) {
  const { intl } = useIntl()
  const { routeParams } = useRoute()
  const { computeDirectory, fetchDirectory } = useDirectory()
  // const { navigate } = useNavigationHelpers()
  const { computeSearchDialect, searchDialectUpdate, searchDialectReset } = useSearchDialect()
  const [partsOfSpeechOptions, setPartsOfSpeechOptions] = useState(null)
  const [partsOfSpeechRequested, setPartsOfSpeechRequested] = useState(false)

  const {
    searchByMode,
    searchBySettings = {},
    searchMessage,
    searchNxqlSort,
    searchNxqlQuery,
    searchTerm,
    searchType,
  } = computeSearchDialect
  const { letter, category, phraseBook } = routeParams

  const dialectClassName = getDialectClassname()

  // Component gets remounted a lot so it's useful to store
  // component state in Redux
  // ------------------------------------------------------------
  // Default settings, ie: not "filtering by..."
  useEffect(() => {
    if (!letter && !category && !phraseBook) {
      const defaultData = {
        searchByAlphabet: '',
        searchByMode: searchByMode || SEARCH_BY_CUSTOM,
        // searchBySettings describes the form state, eg: "input X is checked"
        searchBySettings: searchBySettings || generateDefaultUiSettingsFromPropsSearchUI(),
        searchTerm: searchTerm || '',
        searchType: searchType || SEARCH_TYPE_DEFAULT_SEARCH,
      }
      defaultData.searchMessage = getSearchMessage(defaultData)
      defaultData.searchingDialectFilter = undefined
      defaultData.searchNxqlQuery = searchNxqlQuery || undefined
      defaultData.searchNxqlSort = searchNxqlSort || {}
      searchDialectUpdate(defaultData)
    }
  }, [])

  // When filtering by letter
  // ------------------------------------------------------------
  useEffect(() => {
    if (letter) {
      const letterData = {
        searchByAlphabet: letter,
        searchByMode: SEARCH_BY_ALPHABET,
        searchBySettings: generateDefaultUiSettingsFromPropsSearchUI(),
        searchTerm: '',
        searchType: SEARCH_TYPE_DEFAULT_SEARCH,
      }
      letterData.searchMessage = getSearchMessage(letterData)
      letterData.searchingDialectFilter = undefined
      searchDialectUpdate(letterData)
    }
  }, [letter])

  // When filtering by category
  // ------------------------------------------------------------
  useEffect(() => {
    if (category) {
      const categoryData = {
        searchByAlphabet: '',
        searchByMode: SEARCH_BY_CATEGORY,
        searchBySettings: generateDefaultUiSettingsFromPropsSearchUI(),
        searchTerm: '',
        searchType: SEARCH_TYPE_DEFAULT_SEARCH,
      }
      categoryData.searchMessage = getSearchMessage(categoryData)
      categoryData.searchingDialectFilter = category
      searchDialectUpdate(categoryData)
    }
  }, [category])

  // When filtering by phraseBook
  // ------------------------------------------------------------
  useEffect(() => {
    if (phraseBook) {
      const phraseBookData = {
        searchByAlphabet: '',
        searchByMode: SEARCH_BY_PHRASE_BOOK,
        searchBySettings: generateDefaultUiSettingsFromPropsSearchUI(),
        searchTerm: '',
        searchType: SEARCH_TYPE_DEFAULT_SEARCH,
      }
      phraseBookData.searchMessage = getSearchMessage(phraseBookData)
      phraseBookData.searchingDialectFilter = phraseBook
      searchDialectUpdate(phraseBookData)
    }
  }, [phraseBook])

  // When on a word page, generate markup for the select list
  // REFACTOR: could this be passed in as a prop? or the entire form markup as children?
  // ------------------------------------------------------------
  useEffect(() => {
    const partsOfSpeech = selectn('directoryEntries.parts_of_speech', computeDirectory) || []

    // Gets data
    // TODO: This is a data component responsibility. Move it out when one is created.
    // NOTE: used to rely on Redux booleans (isFetching, success) to determine if we should make a request
    // React would rerender before Redux could set the flag and so we'd initiate duplicate requests
    // That's why we are using a local `partsOfSpeechRequested` flag
    if (
      searchDialectDataType === SEARCH_DATA_TYPE_WORD &&
      partsOfSpeech.length === 0 &&
      partsOfSpeechRequested !== true
    ) {
      setPartsOfSpeechRequested(true)
      fetchDirectory('parts_of_speech')
    }

    if (computeDirectory.success) {
      // sort entires, create markup
      const partsOfSpeechUnsorted = selectn('directoryEntries.parts_of_speech', computeDirectory) || []
      const partsOfSpeechSorted = partsOfSpeechUnsorted.sort((a, b) => {
        if (a.text < b.text) return -1
        if (a.text > b.text) return 1
        return 0
      })

      const partsOfSpeechSortedOptionTags = partsOfSpeechSorted.map((part, index) => {
        return (
          <option key={index} value={part.value}>
            {part.text}
          </option>
        )
      })

      // save markup into `partsOfSpeechOptions`
      if (partsOfSpeechSortedOptionTags.length > 0 && partsOfSpeechOptions === null) {
        setPartsOfSpeechOptions([
          <option key="SEARCH_SORT_DIVIDER" disabled>
            ─────────────
          </option>,
          ...partsOfSpeechSortedOptionTags,
        ])
      }
    }
  }, [computeDirectory])

  // Generate default UI settings from props.searchUi
  // ------------------------------------------------------------
  const generateDefaultUiSettingsFromPropsSearchUI = () => {
    const resetSearchBySettings = {}
    searchUi.forEach((element) => {
      if (element.idName === 'searchPartOfSpeech') {
        resetSearchBySettings[element.idName] = SEARCH_PART_OF_SPEECH_ANY
      } else {
        if (element.defaultChecked) {
          resetSearchBySettings[element.idName] = element.defaultChecked
        }
      }
    })
    return resetSearchBySettings
  }

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
        if (!searchTerm || searchTerm === '') {
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

  // Search handler
  // ------------------------------------------------------------
  const _handleSearch = () => {
    const searchData = {
      searchByAlphabet: '',
      searchByMode: SEARCH_BY_CUSTOM,
      searchBySettings: searchBySettings || generateDefaultUiSettingsFromPropsSearchUI(),
      searchTerm: searchTerm || '',
      searchType: searchType || SEARCH_TYPE_DEFAULT_SEARCH,
    }
    searchData.searchMessage = getSearchMessage(searchData)
    searchData.searchingDialectFilter = undefined
    searchData.searchNxqlQuery = searchNxqlQuery || undefined
    searchData.searchNxqlSort = searchNxqlSort || {}
    searchDialectUpdate(searchData)

    // Notify ancestors
    handleSearch()

    // Update url?
    // navigate()
  }

  // Handles checkbox/select changes
  // ------------------------------------------------------------
  const handleChangeSearchBySettings = (evt) => {
    const { id, checked, value, type } = evt.target

    const updateState = {}

    // Gather up the form state
    if (type === 'checkbox') {
      updateState[id] = checked
    } else {
      updateState[id] = value
    }

    // Save it
    const handleChangeSearchBySettingsData = Object.assign({}, searchBySettings, updateState)
    searchDialectUpdate({
      searchBySettings: handleChangeSearchBySettingsData,
    })
  }

  // Handles search by enter key
  // ------------------------------------------------------------
  const handleEnterSearch = (evt) => {
    if (evt.key === 'Enter') {
      handleSearch()
    }
  }

  // Resets search
  // ------------------------------------------------------------
  const _resetSearch = () => {
    searchDialectReset()
    const searchData = {
      searchByAlphabet: '',
      searchByMode: SEARCH_BY_CUSTOM,
      searchBySettings: generateDefaultUiSettingsFromPropsSearchUI(),
      searchTerm: '',
      searchType: searchType || SEARCH_TYPE_DEFAULT_SEARCH,
    }
    searchDialectUpdate(searchData)

    // Notify ancestors
    resetSearch()
  }
  return children({
    dialectClassName,
    handleChangeSearchBySettings,
    handleEnterSearch,
    handleSearch: _handleSearch,
    intl,
    partsOfSpeechOptions,
    resetSearch: _resetSearch,
    searchByMode,
    searchBySettings,
    searchDialectDataType,
    searchDialectUpdate,
    searchMessage,
    searchNxqlQuery,
    searchTerm,
    searchType,
    searchUi,
  })
}
// PROPTYPES
const { func, number, array } = PropTypes
SearchDialectData.propTypes = {
  children: func,
  searchDialectDataType: number,
  searchUi: array,
  handleSearch: func,
  resetSearch: func,
}

export default SearchDialectData
