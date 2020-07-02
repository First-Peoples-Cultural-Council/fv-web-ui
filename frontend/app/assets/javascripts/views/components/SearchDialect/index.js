import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

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
} from './constants'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchDirectory } from 'providers/redux/reducers/directory'
import useSearchDialect from 'DataSource/useSearchDialect'

import selectn from 'selectn'
import classNames from 'classnames'
import FVButton from 'views/components/FVButton'
import { getDialectClassname } from 'views/pages/explore/dialect/helpers'

/*
SearchDialect
------------------------------------------------------------------------------------------
*/
export const SearchDialect = (props) => {
  const { computeSearchDialect, searchDialectUpdate, searchDialectReset } = useSearchDialect()
  const csd = computeSearchDialect
  const [partsOfSpeechOptions, setPartsOfSpeechOptions] = useState(null)
  const [partsOfSpeechRequested, setPartsOfSpeechRequested] = useState(false)

  // Component gets remounted a lot so it's useful to store
  // component state in Redux
  // ------------------------------------------------------------
  // Default settings, ie: not "filtering by..."
  useEffect(() => {
    const { letter, category, phraseBook } = props.routeParams
    if (!letter && !category && !phraseBook) {
      const defaultData = {
        searchByAlphabet: '',
        searchByMode: csd.searchByMode || SEARCH_BY_CUSTOM,
        // searchBySettings describes the form state, eg: "input X is checked"
        searchBySettings: csd.searchBySettings || generateDefaultUiSettingsFromPropsSearchUI(),
        searchTerm: csd.searchTerm || '',
        searchType: csd.searchType || SEARCH_TYPE_DEFAULT_SEARCH,
      }
      defaultData.searchMessage = getSearchMessage(defaultData)
      defaultData.searchingDialectFilter = undefined
      defaultData.searchNxqlQuery = csd.searchNxqlQuery || undefined
      defaultData.searchNxqlSort = csd.searchNxqlSort || {}
      searchDialectUpdate(defaultData)
    }
  }, [])

  // When filtering by letter
  // ------------------------------------------------------------
  useEffect(() => {
    const { letter } = props.routeParams
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
  }, [props.routeParams.letter])

  // When filtering by category
  // ------------------------------------------------------------
  useEffect(() => {
    const { category } = props.routeParams
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
  }, [props.routeParams.category])

  // When filtering by phraseBook
  // ------------------------------------------------------------
  useEffect(() => {
    const { phraseBook } = props.routeParams
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
  }, [props.routeParams.phraseBook])

  // When on a word page, generate markup for the select list
  // REFACTOR: could this be passed in as a prop? or the entire form markup as children?
  // ------------------------------------------------------------
  useEffect(() => {
    const partsOfSpeech = selectn('directoryEntries.parts_of_speech', props.computeDirectory) || []

    // Gets data
    // TODO: This is a data component responsibility. Move it out when one is created.
    // NOTE: used to rely on Redux booleans (isFetching, success) to determine if we should make a request
    // React would rerender before Redux could set the flag and so we'd initiate duplicate requests
    // That's why we are using a local `partsOfSpeechRequested` flag
    if (
      props.searchDialectDataType === SEARCH_DATA_TYPE_WORD &&
      partsOfSpeech.length === 0 &&
      partsOfSpeechRequested !== true
    ) {
      setPartsOfSpeechRequested(true)
      props.fetchDirectory('parts_of_speech')
    }

    if (props.computeDirectory.success) {
      // sort entires, create markup
      const partsOfSpeechUnsorted = selectn('computeDirectory.directoryEntries.parts_of_speech', props) || []
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
  }, [props.computeDirectory])

  // Generate default UI settings from props.searchUi
  // ------------------------------------------------------------
  const generateDefaultUiSettingsFromPropsSearchUI = () => {
    const resetSearchBySettings = {}
    props.searchUi.forEach((element) => {
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

  // Generates 'Stop browsing ...' button
  // ------------------------------------------------------------
  const getBrowsing = () => {
    const { searchByMode } = csd
    let resetButtonText = ''
    switch (searchByMode) {
      case SEARCH_BY_ALPHABET:
        resetButtonText = 'Stop browsing Alphabetically'
        break
      case SEARCH_BY_CATEGORY:
        resetButtonText = 'Stop browsing by Category'
        break
      case SEARCH_BY_PHRASE_BOOK:
        resetButtonText = 'Stop browsing by Phrase Book'
        break
      default:
        resetButtonText = 'Stop browsing and clear filter'
    }
    return (
      <div className="SearchDialectForm SearchDialectForm--filtering">
        <FVButton
          variant="contained"
          onClick={() => {
            resetSearch()
          }}
          color="primary"
        >
          {resetButtonText}
        </FVButton>
      </div>
    )
  }

  // Generates the markup for the search form
  // ------------------------------------------------------------
  const getSearchForm = () => {
    const resetButtonText = 'Reset search'

    let searchButtonText = ''
    switch (props.searchDialectDataType) {
      case SEARCH_DATA_TYPE_WORD:
        searchButtonText = props.intl.trans(
          'views.pages.explore.dialect.learn.words.search_words',
          'Search Words',
          'words'
        )
        break
      case SEARCH_DATA_TYPE_PHRASE:
        searchButtonText = 'Search Phrases'
        break

      default: // NOTE: do nothing
    }

    return (
      <div className="SearchDialectForm">
        <div className="SearchDialectFormPrimary">
          <input
            data-testid="SearchDialectFormPrimaryInput"
            className={`SearchDialectFormPrimaryInput ${getDialectClassname()}`}
            type="text"
            onChange={(evt) => {
              searchDialectUpdate({ searchTerm: evt.target.value })
            }}
            onKeyPress={handleEnterSearch}
            value={csd.searchTerm || ''}
          />

          <select
            defaultValue={csd.searchType || SEARCH_TYPE_DEFAULT_SEARCH}
            onChange={(evt) => {
              searchDialectUpdate({ searchType: evt.target.value })
            }}
            data-testid="SearchDialectFormSelectSearchType"
            className={`SearchDialectFormSelectSearchType ${getDialectClassname()}`}
          >
            <option value={SEARCH_TYPE_DEFAULT_SEARCH}>Default</option>
            <option value={SEARCH_TYPE_APPROXIMATE_SEARCH}>Approximate</option>
            <option value={SEARCH_TYPE_EXACT_SEARCH}>Exact</option>
            <option value={SEARCH_TYPE_CONTAINS_SEARCH}>Contains</option>
            <option value={SEARCH_TYPE_STARTS_WITH_SEARCH}>Starts with</option>
            <option value={SEARCH_TYPE_ENDS_WITH_SEARCH}>Ends with</option>
            <option value={SEARCH_TYPE_WILDCARD_SEARCH}>Wildcard</option>
          </select>

          <FVButton variant="contained" onClick={_handleSearch} color="primary">
            {searchButtonText}
          </FVButton>
          {/* Show/Hide reset button */}
          {csd.searchNxqlQuery ? (
            <FVButton variant="contained" onClick={resetSearch} style={{ marginLeft: '20px' }}>
              {resetButtonText}
            </FVButton>
          ) : null}
        </div>

        <div className="SearchDialectFormSecondary">{getSearchUi()}</div>
      </div>
    )
  }

  // Generates the 'You are searching ...' message
  // ------------------------------------------------------------
  const getSearchMessage = ({
    searchByAlphabet,
    searchByMode,
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
      switch (props.searchDialectDataType) {
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
    switch (props.searchDialectDataType) {
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

    const searchTermTag = <strong className={getDialectClassname()}>{_searchTerm}</strong>
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
          <strong className={getDialectClassname()}>{searchByAlphabet}</strong>
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

    switch (props.searchDialectDataType) {
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

    switch (searchByMode) {
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
        if (!csd.searchTerm || csd.searchTerm === '') {
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

  // Generates the checkboxes/selects under the search input
  // ------------------------------------------------------------
  const getSearchUi = () => {
    const { searchUi } = props
    const { searchBySettings = {} } = computeSearchDialect
    const classesDefault = {
      SearchDialectFormSecondaryGroup: 'SearchDialectFormSecondaryGroup',
      SearchDialectOption: 'SearchDialectOption',
      SearchDialectLabel: 'SearchDialectLabel',
    }

    return searchUi.map((searchUiData, key1) => {
      const { type, idName, labelText, classes = {} } = searchUiData
      const _classes = Object.assign({}, classesDefault, classes)
      let element = null
      switch (type) {
        case 'select': {
          const { options = [] } = searchUiData

          const optionItems =
            options.length > 0
              ? options.map((option, key2) => {
                  return (
                    <option key={key2} value={option.value}>
                      {option.text}
                    </option>
                  )
                })
              : partsOfSpeechOptions
          element = (
            <span key={key1} className={_classes.SearchDialectFormSecondaryGroup}>
              <label className={_classes.SearchDialectLabel} htmlFor={idName}>
                {labelText}
              </label>
              <select
                className={_classes.SearchDialectOption}
                id={idName}
                name={idName}
                onChange={handleChangeSearchBySettings}
                value={searchBySettings[idName]}
              >
                <option key="SEARCH_PART_OF_SPEECH_ANY" value={SEARCH_PART_OF_SPEECH_ANY}>
                  Any
                </option>

                {optionItems}
              </select>
            </span>
          )
          break
        }
        default:
          element = (
            <span key={key1} className={_classes.SearchDialectFormSecondaryGroup}>
              <input
                checked={searchBySettings[idName] || false}
                className={_classes.SearchDialectOption}
                id={idName}
                name={idName}
                onChange={handleChangeSearchBySettings}
                type="checkbox"
              />
              <label className={_classes.SearchDialectLabel} htmlFor={idName}>
                {labelText}
              </label>
            </span>
          )
      }
      return element
    })
  }

  // Search handler
  // ------------------------------------------------------------
  const _handleSearch = () => {
    const searchData = {
      searchByAlphabet: '',
      searchByMode: SEARCH_BY_CUSTOM,
      searchBySettings: csd.searchBySettings || generateDefaultUiSettingsFromPropsSearchUI(),
      searchTerm: csd.searchTerm || '',
      searchType: csd.searchType || SEARCH_TYPE_DEFAULT_SEARCH,
    }
    searchData.searchMessage = getSearchMessage(searchData)
    searchData.searchingDialectFilter = undefined
    searchData.searchNxqlQuery = csd.searchNxqlQuery || undefined
    searchData.searchNxqlSort = csd.searchNxqlSort || {}
    searchDialectUpdate(searchData)

    // Notify ancestors
    props.handleSearch()
  }

  // Handles checkbox/select changes
  // ------------------------------------------------------------
  const handleChangeSearchBySettings = (evt) => {
    const { id, checked, value, type } = evt.target

    const updateState = {}

    // Gather up the form state
    switch (type) {
      case 'checkbox': {
        updateState[id] = checked
        break
      }
      default:
        updateState[id] = value
    }

    // Save it
    const handleChangeSearchBySettingsData = Object.assign({}, csd.searchBySettings, updateState)
    searchDialectUpdate({
      searchBySettings: handleChangeSearchBySettingsData,
    })
  }

  // Handles search by enter key
  // ------------------------------------------------------------
  const handleEnterSearch = (evt) => {
    if (evt.key === 'Enter') {
      _handleSearch()
    }
  }

  // Resets search
  // ------------------------------------------------------------
  const resetSearch = () => {
    searchDialectReset()
    const searchData = {
      searchByAlphabet: '',
      searchByMode: SEARCH_BY_CUSTOM,
      searchBySettings: generateDefaultUiSettingsFromPropsSearchUI(),
      searchTerm: '',
      searchType: csd.searchType || SEARCH_TYPE_DEFAULT_SEARCH,
    }
    searchDialectUpdate(searchData)

    // Notify ancestors
    props.resetSearch()
  }

  // Render
  // ------------------------------------------------------------
  const { searchByMode, searchMessage } = csd
  let searchBody = null
  if (
    searchByMode === SEARCH_BY_ALPHABET ||
    searchByMode === SEARCH_BY_CATEGORY ||
    searchByMode === SEARCH_BY_PHRASE_BOOK
  ) {
    searchBody = getBrowsing()
  } else {
    searchBody = getSearchForm()
  }

  return (
    <div data-testid="SearchDialect" className="SearchDialect">
      {searchMessage}
      {searchBody}
    </div>
  )
}

// Proptypes
// ------------------------------------------------------------
const { array, func, string, number, object } = PropTypes
SearchDialect.propTypes = {
  handleSearch: func,
  searchDialectDataType: number,
  resetSearch: func,
  searchingDialectFilter: string, // Search by Categories
  searchUi: array.isRequired,
  searchByAlphabet: string,
  searchByMode: string,
  searchBySettings: string,
  searchTerm: string,
  searchType: string,

  // REDUX: reducers/state
  computeDirectory: object.isRequired,
  routeParams: object.isRequired,
  intl: object.isRequired,
  matchedPage: object.isRequired,
  // REDUX: actions/dispatch/func
  fetchDirectory: func.isRequired,
}
SearchDialect.defaultProps = {
  handleSearch: () => {},
  searchDialectDataType: SEARCH_DATA_TYPE_WORD,
  searchPartOfSpeech: SEARCH_PART_OF_SPEECH_ANY,
  searchUi: [
    // Sample structure:
    // {
    //   defaultChecked: true,
    //   idName: 'searchByTitle',
    //   labelText: 'Word',
    // },
    // {
    //   idName: 'searchByDefinitions',
    //   labelText: 'Definitions',
    // },
    // {
    //   idName: 'searchByCulturalNotes',
    //   labelText: 'Cultural notes',
    // },
    // {
    //   idName: 'searchByTranslations',
    //   labelText: 'Literal translations',
    // },
    // {
    //   type: 'select',
    //   value: 'test',
    //   idName: 'searchPartOfSpeech',
    //   labelText: 'Parts of speech:',
    //   options: [
    //     {
    //       value: 'test',
    //       text: 'Test',
    //     },
    //   ],
    // },
  ],
}

// Redux
// ------------------------------------------------------------
// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { directory, navigation, locale } = state
  const { computeDirectory } = directory
  const { intlService } = locale
  const { route } = navigation

  return {
    computeDirectory,
    routeParams: route.routeParams,
    matchedPage: route.matchedPage,
    intl: intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDirectory,
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchDialect)
