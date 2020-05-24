import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import {
  SEARCH_PART_OF_SPEECH_ANY,
  SEARCH_BY_DEFAULT,
  SEARCH_TYPE_DEFAULT,
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
import { searchDialectUpdate } from 'providers/redux/reducers/searchDialect'

import selectn from 'selectn'
import classNames from 'classnames'
import FVButton from 'views/components/FVButton'
import { getDialectClassname } from 'views/pages/explore/dialect/helpers'

/*
SearchDialect
------------------------------------------------------------------------------------------
*/
export const SearchDialect = (props) => {
  const csd = props.computeSearchDialect
  const [partsOfSpeechOptions, setPartsOfSpeechOptions] = useState(null)
  const [partsOfSpeechRequested, setPartsOfSpeechRequested] = useState(false)
  const [searchBySettings, setSearchBySettings] = useState({})
  const [searchTerm, setSearchTerm] = useState(csd.searchTerm || undefined)
  const [searchType, setSearchType] = useState(csd.searchType || SEARCH_TYPE_DEFAULT)

  // Updates redux store when changes are made to routeParams[letter||category||phraseBook]
  useEffect(() => {
    const letter = props.routeParams.letter
    const category = props.routeParams.category
    const phraseBook = props.routeParams.phraseBook

    if (letter) {
      const letterData = {
        searchByAlphabet: letter,
        searchByMode: SEARCH_BY_ALPHABET,
        searchBySettings: generateDefaultUiSettingsFromPropsSearchUI(),
        searchTerm: '',
        searchType: csd.searchType || searchType,
      }
      letterData.searchMessage = getSearchMessage(letterData)
      letterData.searchingDialectFilter = ''
      props.searchDialectUpdate(letterData)
      return
    }
    if (category) {
      const categoryData = {
        searchByAlphabet: '',
        searchByMode: SEARCH_BY_CATEGORY,
        searchBySettings: generateDefaultUiSettingsFromPropsSearchUI(),
        searchTerm: '',
        searchType: csd.searchType || searchType,
      }
      categoryData.searchMessage = getSearchMessage(categoryData)
      categoryData.searchingDialectFilter = category

      props.searchDialectUpdate(categoryData)
      return
    }
    if (phraseBook) {
      const phraseBookData = {
        searchByAlphabet: '',
        searchByMode: SEARCH_BY_PHRASE_BOOK,
        searchBySettings: generateDefaultUiSettingsFromPropsSearchUI(),
        searchTerm: '',
        searchType: csd.searchType || searchType,
      }
      phraseBookData.searchMessage = getSearchMessage(phraseBookData)
      phraseBookData.searchingDialectFilter = phraseBook

      props.searchDialectUpdate(phraseBookData)
      return
    }

    // If all the above fail...
    props.searchDialectUpdate({
      searchByAlphabet: '',
      searchByMode: SEARCH_BY_DEFAULT,
      searchBySettings: csd.searchBySettings || searchBySettings,
      searchingDialectFilter: undefined,
      searchMessage: getSearchMessage({
        searchByAlphabet: csd.searchByAlphabet || '',
        searchByMode: csd.searchByMode || SEARCH_BY_DEFAULT,
        searchBySettings: csd.searchBySettings || searchBySettings,
        searchTerm: csd.searchTerm || searchTerm,
        searchType: csd.searchType || searchType,
      }),
      searchNxqlQuery: undefined,
      searchNxqlSort: {},
    })
  }, [props.routeParams.letter, props.routeParams.category, props.routeParams.phraseBook])

  // Sets `searchBySettings` when `csd.searchBySettings` changes
  // ------------------------------------------------------------
  useEffect(() => {
    if (csd.searchBySettings) {
      // Setting searchBySettings via Redux
      setSearchBySettings(csd.searchBySettings)
    } else {
      // Setting searchBySettings via searchUi
      const { searchUi = [] } = props
      const searchBySettingsViaProp = {}
      searchUi.forEach((searchUiData) => {
        const { type, defaultChecked = false, idName } = searchUiData
        switch (type) {
          case 'select': {
            const { value } = searchUiData
            if (value) {
              searchBySettingsViaProp[idName] = value
            }
            break
          }
          default:
            if (defaultChecked) {
              searchBySettingsViaProp[idName] = true
            }
        }
      })
      setSearchBySettings(searchBySettingsViaProp)
    }
  }, [csd.searchBySettings])

  // Sets `partsOfSpeechOptions` when on a Word page
  // ------------------------------------------------------------
  useEffect(() => {
    const partsOfSpeech = selectn('directoryEntries.parts_of_speech', props.computeDirectory) || []
    // initiate
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

    // wait
    if (props.computeDirectory.success) {
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

      // set
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

  // Generates 'Stop browsing ...' button
  // TODO: props.searchDialectResetButtonText
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
  // TODO: props.searchDialectSearchButtonText
  // TODO: props.searchDialectResetButtonText
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
              setSearchTerm(evt.target.value)
            }}
            onKeyPress={handleEnterSearch}
            value={searchTerm || ''}
          />

          <select
            defaultValue={searchType}
            onChange={(evt) => {
              setSearchType(evt.target.value)
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

          <FVButton variant="contained" onClick={handleSearch} color="primary">
            {searchButtonText}
          </FVButton>

          <FVButton variant="contained" onClick={resetSearch} style={{ marginLeft: '20px' }}>
            {resetButtonText}
          </FVButton>
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

  // Generates the checkboxes/selects under the search input
  // ------------------------------------------------------------
  const getSearchUi = () => {
    const { searchUi } = props
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
  const handleSearch = async () => {
    const searchData1 = {
      searchByAlphabet: '',
      searchByMode: SEARCH_BY_CUSTOM,
      searchBySettings,
      searchTerm,
      searchType,
    }

    const searchData2 = {
      searchingDialectFilter: '',
      searchMessage: getSearchMessage(searchData1),
    }

    const searchData = Object.assign({}, searchData1, searchData2)

    // Save to redux
    await props.searchDialectUpdate(searchData)

    // Notify ancestors
    props.handleSearch()
  }

  // Handles checkbox/select changes
  // ------------------------------------------------------------
  const handleChangeSearchBySettings = (evt) => {
    const { id, checked, value, type } = evt.target

    const updateState = {}

    // Record changes
    switch (type) {
      case 'checkbox': {
        updateState[id] = checked
        break
      }
      default:
        updateState[id] = value
    }

    setSearchBySettings(Object.assign({}, searchBySettings, updateState))
  }

  // Handles search by enter key
  // ------------------------------------------------------------
  const handleEnterSearch = (evt) => {
    if (evt.key === 'Enter') {
      handleSearch()
    }
  }

  // Generate default UI settings from props.searchUi
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

  // Resets search
  // ------------------------------------------------------------
  const resetSearch = async () => {
    // Save to redux
    await props.searchDialectUpdate({
      searchByAlphabet: '',
      searchByMode: SEARCH_BY_DEFAULT,
      searchBySettings: undefined,
      searchingDialectFilter: undefined,
      searchMessage: null,
      searchNxqlQuery: undefined,
      searchNxqlSort: {},
      searchPartOfSpeech: SEARCH_PART_OF_SPEECH_ANY,
      searchTerm: undefined,
    })

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
  computeSearchDialect: object.isRequired,
  // REDUX: actions/dispatch/func
  searchDialectUpdate: func,
  fetchDirectory: func.isRequired,
}
SearchDialect.defaultProps = {
  handleSearch: () => {},
  searchDialectDataType: SEARCH_DATA_TYPE_WORD,
  resetSearch: () => {},
  searchDialectUpdate: () => {},
  searchPartOfSpeech: SEARCH_PART_OF_SPEECH_ANY,
  searchUi: [
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
  const { directory, searchDialect, navigation, locale } = state

  const { computeDirectory } = directory
  const { computeSearchDialect } = searchDialect
  const { intlService } = locale
  const { route } = navigation

  return {
    computeDirectory,
    computeSearchDialect,
    routeParams: route.routeParams,
    intl: intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDirectory,
  searchDialectUpdate,
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchDialect)
