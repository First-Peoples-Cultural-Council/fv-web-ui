import React, { useState, useEffect } from 'react'
import PropTypes, { array } from 'prop-types'
// import { is } from 'immutable'
import {
  SEARCH_PART_OF_SPEECH_ANY,
  SEARCH_BY_DEFAULT,
  SEARCH_BY_ALPHABET,
  SEARCH_BY_CATEGORY,
  SEARCH_BY_CUSTOM,
  SEARCH_BY_PHRASE_BOOK,
} from './constants'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchDirectory } from 'providers/redux/reducers/directory'
import { searchDialectUpdate } from 'providers/redux/reducers/searchDialect'

// import { getSearchObject } from 'common/NavigationHelpers'
import StringHelpers, { CLEAN_NXQL } from 'common/StringHelpers'
import selectn from 'selectn'
import classNames from 'classnames'
import FVButton from 'views/components/FVButton'
import IntlService from 'views/services/intl'
import { getDialectClassname } from 'views/pages/explore/dialect/helpers'

const intl = IntlService.instance
const { func, string, bool, object } = PropTypes

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
  const [partsOfSpeechOptions, setPartsOfSpeechOptions] = useState(null)
  const [searchBySettings, setSearchBySettings] = useState({})
  const [searchMessage, setSearchMessage] = useState()
  // const [searchNxqlQuery, setSearchNxqlQuery] = useState()
  // const [searchNxqlSort, setSearchNxqlSort] = useState()
  const [searchTerm, setSearchTerm] = useState()

  // Sets searchBySettings from values in optional props.searchUi
  useEffect(() => {
    const { searchUi = [] } = props
    const updateState = {}
    searchUi.forEach((searchUiData) => {
      const { type, defaultChecked = false, idName } = searchUiData
      switch (type) {
        case 'select': {
          const { value } = searchUiData
          if (value) {
            updateState[idName] = value
          }
          break
        }
        default:
          if (defaultChecked) {
            updateState[idName] = true
          }
      }
    })
    setSearchBySettings(Object.assign({}, searchBySettings, updateState))
  }, [props.searchUi])

  // Sets partsOfSpeechOptions
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
    // console.log('debug generateNxql', generateNxql())
    // console.log('debug 2', getNxqlSearchSort())
  })

  /*
  useEffect(() => {
    // setSearchMessage(
    //   getSearchMessage({
    //     searchByAlphabet: props.computeSearchDialect.searchByAlphabet,
    //     searchByCulturalNotes,
    //     searchByDefinitions,
    //     searchByMode,
    //     searchByTitle,
    //     searchByTranslations,
    //     searchingDialectFilter: props.searchingDialectFilter,
    //     searchPartOfSpeech,
    //     searchTerm,
    //   })
    // )
    console.log('searchmessage', {
      searchByAlphabet: props.computeSearchDialect.searchByAlphabet,
      searchingDialectFilter: props.searchingDialectFilter,
      searchByMode: props.computeSearchDialect.searchByMode,
    })
  }, [
    props.computeSearchDialect.searchByAlphabet,
    props.searchingDialectFilter,
    props.computeSearchDialect.searchByMode,
  ])
  */

  // componentDidUpdate(prevProps) {
  //   const searchNxqlQuery = generateNxql()
  //   const searchNxqlSort = getNxqlSearchSort()

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

  const getSearchUi = () => {
    const { searchUi } = props
    const classesDefault = {
      SearchDialectFormSecondaryGroup: 'SearchDialectFormSecondaryGroup',
      SearchDialectOption: 'SearchDialectOption',
      SearchDialectLabel: 'SearchDialectLabel',
    }
    return searchUi.map((searchUiData, key1) => {
      const { type, defaultChecked = false, idName, title, classes = {} } = searchUiData
      const _classes = Object.assign({}, classesDefault, classes)
      let element = null
      switch (type) {
        case 'select': {
          const { value, options = [] } = searchUiData
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
                {title}
              </label>
              <select
                className={_classes.SearchDialectOption}
                id={idName}
                name={idName}
                onChange={handleChangeSearchBySettings}
                value={value}
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
                defaultChecked={defaultChecked}
                className={_classes.SearchDialectOption}
                id={idName}
                name={idName}
                onChange={handleChangeSearchBySettings}
                type="checkbox"
              />
              <label className={_classes.SearchDialectLabel} htmlFor={idName}>
                {title}
              </label>
            </span>
          )
      }
      return element
    })
  }

  const getBrowsing = () => {
    const { searchByMode } = props.computeSearchDialect
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

  const getSearchForm = () => {
    const { isSearchingPhrases } = props
    let searchButtonText = ''
    const resetButtonText = 'Reset search'
    // let searchByTitleText = ''
    if (isSearchingPhrases) {
      // searchByTitleText = 'Phrase'
      searchButtonText = 'Search Phrases'
    } else {
      // searchByTitleText = 'Word'
      searchButtonText = intl.trans('views.pages.explore.dialect.learn.words.search_words', 'Search Words', 'words')
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

  // Showing all words in the dictionary listed alphabetically

  // Showing all words in the 'Fish' category

  // Showing words that start with the letter d

  // Showing words that contain the search term 'd'
  // Showing words that contain the search term 'd' in the 'Word' column
  // Showing words that contain the search term 'd' in the 'Definitions' column
  // Showing words that contain the search term 'd' in the 'Literal translations' column
  // Showing words that contain the search term 'd' in the 'Word' and 'Definitions' columns
  // Showing words that contain the search term 'd' in the 'Word' and 'Literal translations' columns
  // Showing words that contain the search term 'd' in the 'Definitions' and 'Literal translations' columns

  // Showing words that contain the search term 'd', filtered by the selected 'Parts of speech'
  // Showing words that contain the search term 'd' in the 'Word' column, filtered by the selected 'Parts of speech'
  // Showing words that contain the search term 'd' in the 'Definitions' column, filtered by the selected 'Parts of speech'
  // Showing words that contain the search term 'd' in the 'Literal translations' column, filtered by the selected 'Parts of speech'
  // Showing words that contain the search term 'd' in the 'Word' and 'Definitions' columns, filtered by the selected 'Parts of speech'
  // Showing words that contain the search term 'd' in the 'Word' and 'Literal translations' columns, filtered by the selected 'Parts of speech'
  // Showing words that contain the search term 'd' in the 'Definitions' and 'Literal translations' columns, filtered by the selected 'Parts of speech'

  const getSearchMessage = ({
    searchByAlphabet,
    searchByMode,
    searchBySettings: _searchBySettings = {},
    searchTerm: _searchTerm,
  }) => {
    const { isSearchingPhrases } = props
    const {
      searchPartOfSpeech,
      searchByTitle,
      searchByDefinitions,
      searchByCulturalNotes,
      searchByTranslations,
    } = _searchBySettings

    const cols = []

    if (searchByTitle) {
      cols.push(isSearchingPhrases ? 'Phrase' : 'Word')
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

    const wordsOrPhrases = isSearchingPhrases ? 'phrases' : 'words'
    const searchTermTag = <strong className={getDialectClassname()}>{_searchTerm}</strong>
    const messagePartsOfSpeech =
      searchPartOfSpeech !== SEARCH_PART_OF_SPEECH_ANY ? ", filtered by the selected 'Parts of speech'" : ''

    const messages = {
      all: isSearchingPhrases ? (
        <span>{`Showing all ${wordsOrPhrases} listed alphabetically${messagePartsOfSpeech}`}</span>
      ) : (
        <span>{`Showing all ${wordsOrPhrases} in the dictionary listed alphabetically${messagePartsOfSpeech}`}</span>
      ),
      byCategory: <span>{`Showing all ${wordsOrPhrases} in the selected category${messagePartsOfSpeech}`}</span>,
      byPhraseBook: <span>{`Showing all ${wordsOrPhrases} from the selected Phrase Book${messagePartsOfSpeech}`}</span>,
      startWith: (
        <span>
          {`Showing ${wordsOrPhrases} that start with the letter '`}
          <strong className={getDialectClassname()}>{searchByAlphabet}</strong>
          {`'${messagePartsOfSpeech}`}
        </span>
      ),
      contain: (
        <span>
          {`Showing ${wordsOrPhrases} that contain the search term '`}
          {searchTermTag}
          {`'${messagePartsOfSpeech}`}
        </span>
      ),
      containColOne: (
        <span>
          {`Showing ${wordsOrPhrases} that contain the search term '`}
          {searchTermTag}
          {`' in the '${cols[0]}' column${messagePartsOfSpeech}`}
        </span>
      ),
      containColsTwo: (
        <span>
          {`Showing ${wordsOrPhrases} that contain the search term '`}
          {searchTermTag}
          {`' in the '${cols[0]}' and '${cols[1]}' columns${messagePartsOfSpeech}`}
        </span>
      ),
      containColsThree: (
        <span>
          {`Showing ${wordsOrPhrases} that contain the search term '`}
          {searchTermTag}
          {`' in the '${cols[0]}', '${cols[1]}', and '${cols[2]}' columns${messagePartsOfSpeech}`}
        </span>
      ),
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

  const getNxqlSearchSort = () => {
    const {
      searchByCulturalNotes,
      searchByDefinitions,
      searchByTitle,
      searchByTranslations,
      searchPartOfSpeech,
    } = searchBySettings
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

    if (searchTerm) {
      return {
        DEFAULT_SORT_COL: searchSortBy,
        DEFAULT_SORT_TYPE: 'asc',
      }
    }
    return {}
  }

  const generateNxql = () => {
    const { searchByMode, searchByAlphabet } = props.computeSearchDialect

    const {
      searchByCulturalNotes,
      searchByDefinitions,
      searchByTitle,
      searchByTranslations,
      searchPartOfSpeech,
    } = searchBySettings

    const search = StringHelpers.clean(searchTerm, CLEAN_NXQL) || ''
    const _searchByAlphabet = StringHelpers.clean(searchByAlphabet, CLEAN_NXQL) || ''
    const nxqlTmpl = {
      // allFields: `ecm:fulltext = '*${StringHelpers.clean(search, CLEAN_FULLTEXT)}*'`,
      searchByTitle: `/*+ES: INDEX(dc:title.fulltext) OPERATOR(match_phrase_prefix) */ ecm:fulltext.dc:title ILIKE '%${search}%'`,
      searchByAlphabet: `dc:title ILIKE '${_searchByAlphabet}%'`,
      searchByCategory: `dc:title ILIKE '%${search}%'`,
      searchByPhraseBook: `dc:title ILIKE '%${search}%'`,
      searchByCulturalNotes: `fv:cultural_note ILIKE '%${search}%'`,
      searchByDefinitions: `fv:definitions/*/translation ILIKE '%${search}%'`,
      searchByTranslations: `fv:literal_translation/*/translation ILIKE '%${search}%'`,
      searchPartOfSpeech: `fv-word:part_of_speech = '${searchPartOfSpeech}'`,
    }

    const nxqlQueries = []
    let nxqlQuerySpeech = ''
    const nxqlQueryJoin = (nxq, join = ' OR ') => {
      if (nxq.length >= 1) {
        nxq.push(join)
      }
    }

    switch (searchByMode) {
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
        if (searchPartOfSpeech && searchPartOfSpeech !== SEARCH_PART_OF_SPEECH_ANY) {
          if (!searchByTitle && search) {
            nxqlQueryJoin(nxqlQueries)
            nxqlQueries.push(nxqlTmpl.searchByTitle)
          }
          // Note: fixes searching only for part of speech 1/2
          nxqlQuerySpeech = `${nxqlQueries.length === 0 ? '' : ' AND '}${nxqlTmpl.searchPartOfSpeech}`
          // nxqlQuerySpeech = ` AND ${nxqlTmpl.searchPartOfSpeech}`
        }
      }
    }

    // Note: fixes searching only for part of speech 2/2
    // Safety
    // if (nxqlQueries.length === 0) {
    //   nxqlQueries.push(nxqlTmpl.searchByTitle)
    // }

    let nxqlQueryCollection = ''
    if (nxqlQueries.length > 0) {
      nxqlQueryCollection = `( ${nxqlQueries.join('')} )`
    }
    return `${nxqlQueryCollection}${nxqlQuerySpeech}`
  }

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

  const handleEnterSearch = (evt) => {
    if (evt.key === 'Enter') {
      handleSearch()
    }
  }
  /*

    const forSearchInfo = {
      searchByAlphabet: '',
      searchByMode: SEARCH_BY_CUSTOM,
      searchBySettings,
      searchingDialectFilter: '',
      searchTerm,
    }
    */
  const handleSearch = () => {
    const reduxUpdate = {
      searchByAlphabet: '',
      searchByMode: SEARCH_BY_CUSTOM,
      searchNxqlQuery: generateNxql(),
      searchNxqlSort: getNxqlSearchSort(),
    }
    const ofInterestToAncestors = {
      searchBySettings,
      searchingDialectFilter: '',
      searchTerm,
    }
    const combinedUpdates = Object.assign({}, reduxUpdate, ofInterestToAncestors)

    setSearchMessage(getSearchMessage(combinedUpdates))
    // const forSearchDialectUpdate = Object.assign(reduxUpdate, ofInterestToAncestors, {
    //   searchMessage: getSearchMessage(forSearchInfo),
    // })
    // Save to redux
    props.searchDialectUpdate(reduxUpdate)

    // Notify ancestor
    props.handleSearch(combinedUpdates)
  }

  const resetSearch = async () => {
    // Reset internal
    setSearchBySettings({})
    setSearchMessage(null)
    setSearchTerm(undefined)

    // Reset external
    const reduxUpdate = {
      searchByAlphabet: '',
      searchByMode: SEARCH_BY_DEFAULT,
      searchNxqlQuery: generateNxql(),
      searchNxqlSort: getNxqlSearchSort(),
    }

    // Save to redux
    await props.searchDialectUpdate(reduxUpdate)
    // Notify ancestor
    props.resetSearch(
      Object.assign({}, reduxUpdate, {
        searchBySettings,
        searchingDialectFilter: '',
        searchTerm,
      })
    )
  }

  const { searchByMode /*, searchMessage*/ } = props.computeSearchDialect
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
SearchDialect.propTypes = {
  handleSearch: func,
  isSearchingPhrases: bool,
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
  isSearchingPhrases: false,
  resetSearch: () => {},
  searchDialectUpdate: () => {},
  searchPartOfSpeech: SEARCH_PART_OF_SPEECH_ANY,
  searchUi: [
    // {
    //   defaultChecked: true,
    //   idName: 'searchByTitle',
    //   title: 'Word',
    // },
    // {
    //   idName: 'searchByDefinitions',
    //   title: 'Definitions',
    // },
    // {
    //   idName: 'searchByCulturalNotes',
    //   title: 'Cultural notes',
    // },
    // {
    //   idName: 'searchByTranslations',
    //   title: 'Literal translations',
    // },
    // {
    //   type: 'select',
    //   value: 'test',
    //   idName: 'searchPartOfSpeech',
    //   title: 'Parts of speech:',
    //   options: [
    //     {
    //       value: 'test',
    //       text: 'Test',
    //     },
    //   ],
    // },
  ],
}
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
