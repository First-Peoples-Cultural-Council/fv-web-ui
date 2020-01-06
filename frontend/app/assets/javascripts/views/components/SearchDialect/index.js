import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import {
  SEARCH_PART_OF_SPEECH_ANY,
  SEARCH_BY_DEFAULT,
  SEARCH_BY_ALPHABET,
  SEARCH_BY_CATEGORY,
  SEARCH_BY_CUSTOM,
  SEARCH_BY_PHRASE_BOOK,
  SEARCH_DATA_TYPE_PHRASE,
  SEARCH_DATA_TYPE_WORD,
} from './constants'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchDirectory } from 'providers/redux/reducers/directory'
import { searchDialectUpdate } from 'providers/redux/reducers/searchDialect'

import selectn from 'selectn'
import classNames from 'classnames'
import FVButton from 'views/components/FVButton'
import IntlService from 'views/services/intl'
import { getDialectClassname } from 'views/pages/explore/dialect/helpers'

const intl = IntlService.instance

/*
SearchDialect
------------------------------------------------------------------------------------------
NOTE: Some data is split between internal (useState) and external (redux)
External data are things that external components can trigger that need to be reflected in this component,
ie: Alphabet or Category buttons clicked in a sidebar

Internal data is local state that is mostly contained,
but some internal data is sent out to ancestors via props: props.handleSearch & props.resetSearch
*/
export const SearchDialect = (props) => {
  const csd = props.computeSearchDialect
  const [partsOfSpeechOptions, setPartsOfSpeechOptions] = useState(null)
  const [searchBySettings, setSearchBySettings] = useState({})
  const [searchTerm, setSearchTerm] = useState(csd.searchTerm || undefined)

  // Sets `searchMessage` when updates are made to:
  // `csd.searchByAlphabet`, `csd.searchByMode`, or `csd.searchingDialectFilter`
  // ------------------------------------------------------------
  useEffect(() => {
    const _searchMessage = getSearchMessage({
      searchByAlphabet: csd.searchByAlphabet || '',
      searchByMode: csd.searchByMode || SEARCH_BY_DEFAULT,
      searchBySettings: csd.searchBySettings || searchBySettings,
      searchTerm: csd.searchTerm || searchTerm,
    })

    // Save to redux
    props.searchDialectUpdate({ searchMessage: _searchMessage })
  }, [csd.searchByAlphabet, csd.searchByMode, csd.searchingDialectFilter])

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

  // Sets `partsOfSpeechOptions`
  // ------------------------------------------------------------
  useEffect(() => {
    // initiate
    if (props.computeDirectory.isFetching !== true && props.computeDirectory.success !== true) {
      props.fetchDirectory('parts_of_speech')
    }
    // wait
    if (props.computeDirectory.success && props.computeDirectory.success) {
      const partsOfSpeechUnsorted = selectn('computeDirectory.directories.parts_of_speech', props)
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
  })

  // const _componentDidUpdate = (prevProps) => {
  //   const searchNxqlQuery = generateNxql()
  //   const searchNxqlSort = generateNxqlSearchSort()

  //   const prevSearchNxqlQuery = prevProps.computeSearchDialect.searchNxqlQuery
  //   const prevSearchNxqlSort = prevProps.computeSearchDialect.searchNxqlSort

  //   if (
  //     searchNxqlQuery !== prevSearchNxqlQuery ||
  //     searchNxqlSort.DEFAULT_SORT_COL !== prevSearchNxqlSort.DEFAULT_SORT_COL ||
  //     searchNxqlSort.DEFAULT_SORT_TYPE !== prevSearchNxqlSort.DEFAULT_SORT_TYPE
  //   ) {
  //     props.searchDialectUpdate({ searchNxqlQuery, searchNxqlSort })
  //   }

  //   const updatedAlphabet =
  //     props.computeSearchDialect.searchByMode === SEARCH_BY_ALPHABET &&
  //     prevProps.computeSearchDialect.searchByAlphabet !== props.computeSearchDialect.searchByAlphabet

  //   const updatedDialectFilter =
  //     (props.computeSearchDialect.searchByMode === SEARCH_BY_CATEGORY ||
  //       props.computeSearchDialect.searchByMode === SEARCH_BY_PHRASE_BOOK) &&
  //     prevProps.searchingDialectFilter !== props.searchingDialectFilter

  //   const updatedMode = prevProps.computeSearchDialect.searchByMode !== props.computeSearchDialect.searchByMode

  //   if (updatedAlphabet || updatedDialectFilter || updatedMode) {
  //     const forSearchDialectUpdate = Object.assign({}, props.computeSearchDialect, {
  //       searchMessage: getSearchMessage(props.computeSearchDialect),
  //     })
  //     props.searchDialectUpdate(forSearchDialectUpdate)
  //   }
  // }

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
        searchButtonText = intl.trans('views.pages.explore.dialect.learn.words.search_words', 'Search Words', 'words')
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

    const searchTermTag = <strong className={getDialectClassname()}>{_searchTerm}</strong>
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
          {`Showing ${dataType} that contain the search term '`}
          {searchTermTag}
          {`' in the '${cols[0]}' column${messagePartsOfSpeech}`}
        </span>
      ),
      containColsTwo: (
        <span>
          {`Showing ${dataType} that contain the search term '`}
          {searchTermTag}
          {`' in the '${cols[0]}' and '${cols[1]}' columns${messagePartsOfSpeech}`}
        </span>
      ),
      containColsThree: (
        <span>
          {`Showing ${dataType} that contain the search term '`}
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

    let msg = ''
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
      default:
        msg = messages.all
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
                checked={searchBySettings[idName]}
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

  // Resets search
  // ------------------------------------------------------------
  const resetSearch = async () => {
    const searchData1 = {
      searchByAlphabet: '',
      searchByMode: SEARCH_BY_DEFAULT,
      searchBySettings: undefined,
      searchTerm: undefined,
    }

    const searchData2 = {
      searchingDialectFilter: '',
      searchMessage: null,
    }

    const searchData = Object.assign({}, searchData1, searchData2)

    // Save to redux
    await props.searchDialectUpdate(searchData)

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
  const { directory, searchDialect } = state

  const { computeDirectory } = directory
  const { computeSearchDialect } = searchDialect

  return {
    computeDirectory,
    computeSearchDialect,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDirectory,
  searchDialectUpdate,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchDialect)
