import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import { is } from 'immutable'
import {
  SEARCH_SORT_DEFAULT,
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
export class SearchDialect extends Component {
  static propTypes = {
    flashcardMode: bool,
    handleSearch: func,
    isSearchingPhrases: bool,
    resetSearch: func,
    searchingDialectFilter: string,

    // REDUX: reducers/state
    computeDirectory: object.isRequired,
    computeSearchDialect: object.isRequired,
    // REDUX: actions/dispatch/func
    searchDialectUpdate: func,
    fetchDirectory: func.isRequired,
  }
  static defaultProps = {
    isSearchingPhrases: false,
    searchDialectUpdate: () => {},
    handleSearch: () => {},
    resetSearch: () => {},
    searchPartOfSpeech: SEARCH_SORT_DEFAULT,
  }

  constructor(props) {
    super(props)

    const {
      searchTerm,
      searchByCulturalNotes,
      searchByTitle,
      searchByDefinitions,
      searchByTranslations,
      searchPartOfSpeech,
    } = this.props.computeSearchDialect

    this.state = {
      partsOfSpeechOptions: null,
      searchTerm,
      searchByCulturalNotes,
      searchByTitle,
      searchByDefinitions,
      searchByTranslations,
      searchPartOfSpeech,
    }
  }

  componentDidMount() {
    this.props.fetchDirectory('parts_of_speech')

    // this._checkURL() // NOTE: query params on hold
  }

  componentDidUpdate(prevProps) {
    const searchNxqlQuery = this._generateNxql()
    const searchNxqlSort = this._getNxqlSearchSort()

    const prevSearchNxqlQuery = prevProps.computeSearchDialect.searchNxqlQuery
    const prevSearchNxqlSort = prevProps.computeSearchDialect.searchNxqlSort

    if (
      searchNxqlQuery !== prevSearchNxqlQuery ||
      searchNxqlSort.DEFAULT_SORT_COL !== prevSearchNxqlSort.DEFAULT_SORT_COL ||
      searchNxqlSort.DEFAULT_SORT_TYPE !== prevSearchNxqlSort.DEFAULT_SORT_TYPE
    ) {
      this.props.searchDialectUpdate({ searchNxqlQuery, searchNxqlSort })
    }

    const prevComputeSuccess = selectn('computeDirectory.success', prevProps)
    const currentComputeSuccess = selectn('computeDirectory.success', this.props)
    if (prevComputeSuccess !== currentComputeSuccess && currentComputeSuccess === true) {
      const _partsOfSpeech = selectn('computeDirectory.directories.parts_of_speech', this.props)
      const _partsOfSpeechSort = _partsOfSpeech.sort((a, b) => {
        if (a.text < b.text) return -1
        if (a.text > b.text) return 1
        return 0
      })

      let partsOfSpeechOptions = null
      const _partsOfSpeechOptions = _partsOfSpeechSort.map((part, index) => {
        return (
          <option key={index} value={part.value}>
            {part.text}
          </option>
        )
      })

      if (_partsOfSpeechOptions.length > 0) {
        partsOfSpeechOptions = [
          <option key="SEARCH_SORT_DIVIDER" disabled>
            ─────────────
          </option>,
          ..._partsOfSpeechOptions,
        ]
      }

      // Note: aware that we are triggering a new render
      // eslint-disable-next-line
      this.setState({ partsOfSpeechOptions })
    }

    const updatedAlphabet =
      this.props.computeSearchDialect.searchByMode === SEARCH_BY_ALPHABET &&
      prevProps.computeSearchDialect.searchByAlphabet !== this.props.computeSearchDialect.searchByAlphabet

    const updatedDialectFilter =
      (this.props.computeSearchDialect.searchByMode === SEARCH_BY_CATEGORY ||
        this.props.computeSearchDialect.searchByMode === SEARCH_BY_PHRASE_BOOK) &&
      prevProps.searchingDialectFilter !== this.props.searchingDialectFilter

    const updatedMode = prevProps.computeSearchDialect.searchByMode !== this.props.computeSearchDialect.searchByMode

    if (updatedAlphabet || updatedDialectFilter || updatedMode) {
      // Note: aware that we are triggering a new render
      // eslint-disable-next-line
      // this.setState({
      //   searchInfoOutput: this._getSearchInfo(),
      // })

      const forSearchDialectUpdate = Object.assign({}, this.props.computeSearchDialect, {
        searchInfoOutput: this._getSearchInfo(this.props.computeSearchDialect),
      })
      this.props.searchDialectUpdate(forSearchDialectUpdate)
    }
  }

  render() {
    const { searchByMode, searchInfoOutput } = this.props.computeSearchDialect

    let searchBody = null
    if (
      searchByMode === SEARCH_BY_ALPHABET ||
      searchByMode === SEARCH_BY_CATEGORY ||
      searchByMode === SEARCH_BY_PHRASE_BOOK
    ) {
      searchBody = this._getBrowse()
    } else {
      searchBody = this._getSearchForm()
    }

    return (
      <div data-testid="SearchDialect" className="SearchDialect">
        {searchInfoOutput}
        {searchBody}
      </div>
    )
  }
  // NOTE: query params on hold
  // The current state of the codebase makes implementing url params difficult.
  // Complicating factors include:
  // - ancestor components extending other components and passing inherited
  //   functions down to descendants
  // - URL/Navigation Helper functions have to be updated to support url params
  // - withPagination HOC
  /*
  _checkURL = () => {
    const { decoder } = this.props.computeSearchDialect
    const searchObj = getSearchObject()
    const searchUpdate = {}

    if (searchObj.active) {
      // Since active is defined, 1st turn off all items:
      searchUpdate.searchByCulturalNotes = false
      searchUpdate.searchByDefinitions = false
      searchUpdate.searchByTitle = false
      searchUpdate.searchByTranslations = false

      // Now iterate through them to turn back on:
      const active = searchObj.active.split(',')
      active.forEach((activeItem) => {
        const key = decoder[activeItem]
        if (key) {
          searchUpdate[decoder[activeItem]] = true
        }
      })
    }
    // Grab query
    if (searchObj.q) {
      searchUpdate.searchTerm = searchObj.q
    }

    // Grab part of speech
    if (searchObj.pos) {
      searchUpdate.searchPartOfSpeech = searchObj.pos
    }

    // if searchUpdate isn't an empty object:
    if (is({}, searchUpdate) === false) {
      this.props.searchDialectUpdate(searchUpdate)
    }
  }
  */

  _getBrowse = () => {
    const { searchByMode } = this.props.computeSearchDialect
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
            this._resetSearch()
          }}
          color="primary"
        >
          {resetButtonText}
        </FVButton>
        {this._getFlashcardMode()}
      </div>
    )
  }
  _getFlashcardMode = () => {
    const { flashcardMode } = this.props

    if (flashcardMode !== undefined) {
      return flashcardMode ? (
        <FVButton
          variant="contained"
          style={{ marginLeft: 'auto' }}
          color="primary"
          onClick={() => {
            this.props.searchDialectUpdate({ flashcardMode: false })
          }}
        >
          {'Stop viewing Flashcards'}
        </FVButton>
      ) : (
        <FVButton
          variant="contained"
          style={{ marginLeft: 'auto' }}
          onClick={() => {
            this.props.searchDialectUpdate({ flashcardMode: true })
          }}
        >
          {'Flashcards'}
        </FVButton>
      )
    }
    return null
  }
  _getSearchForm = () => {
    const { isSearchingPhrases } = this.props
    const {
      searchTerm,
      searchByCulturalNotes,
      searchByTitle,
      searchByDefinitions,
      searchByTranslations,
      searchPartOfSpeech,
    } = this.state
    let searchButtonText = ''
    const resetButtonText = 'Reset search'
    let searchByTitleText = ''
    if (isSearchingPhrases) {
      searchByTitleText = 'Phrase'
      searchButtonText = 'Search Phrases'
    } else {
      searchByTitleText = 'Word'
      searchButtonText = intl.trans('views.pages.explore.dialect.learn.words.search_words', 'Search Words', 'words')
    }

    return (
      <div className="SearchDialectForm">
        <div className="SearchDialectFormPrimary">
          <input
            data-testid="SearchDialectFormPrimaryInput"
            className={`SearchDialectFormPrimaryInput ${getDialectClassname()}`}
            type="text"
            onChange={this._updateSearchTerm}
            onKeyPress={this._handleEnterSearch}
            value={searchTerm || ''}
          />

          <FVButton variant="contained" onClick={this._handleSearch} color="primary">
            {searchButtonText}
          </FVButton>

          <FVButton variant="contained" onClick={this._resetSearch} style={{ marginLeft: '20px' }}>
            {resetButtonText}
          </FVButton>

          {this._getFlashcardMode()}
        </div>

        <div className="SearchDialectFormSecondary">
          <span className="SearchDialectFormSecondaryGroup">
            <input
              defaultChecked={searchByTitle}
              className="SearchDialectOption"
              id="searchByTitle"
              name="searchByTitle"
              onChange={this._handleCustomSearch}
              type="checkbox"
            />
            <label className="SearchDialectLabel" htmlFor="searchByTitle">
              {searchByTitleText}
            </label>
          </span>

          <span className="SearchDialectFormSecondaryGroup">
            <input
              defaultChecked={searchByDefinitions}
              className="SearchDialectOption"
              id="searchByDefinitions"
              name="searchByDefinitions"
              onChange={this._handleCustomSearch}
              type="checkbox"
            />
            <label className="SearchDialectLabel" htmlFor="searchByDefinitions">
              Definitions
            </label>
          </span>

          {isSearchingPhrases && (
            <span className="SearchDialectFormSecondaryGroup">
              <input
                defaultChecked={searchByCulturalNotes}
                className="SearchDialectOption"
                id="searchByCulturalNotes"
                name="searchByCulturalNotes"
                onChange={this._handleCustomSearch}
                type="checkbox"
              />
              <label className="SearchDialectLabel" htmlFor="searchByCulturalNotes">
                Cultural notes
              </label>
            </span>
          )}

          {isSearchingPhrases !== true && (
            <span className="SearchDialectFormSecondaryGroup">
              <input
                defaultChecked={searchByTranslations}
                className="SearchDialectOption"
                id="searchByTranslations"
                name="searchByTranslations"
                onChange={this._handleCustomSearch}
                type="checkbox"
              />
              <label className="SearchDialectLabel" htmlFor="searchByTranslations">
                Literal translations
              </label>
            </span>
          )}

          {isSearchingPhrases !== true && (
            <span className="SearchDialectFormSecondaryGroup">
              <label className="SearchDialectLabel" htmlFor="searchPartOfSpeech">
                Parts of speech:
              </label>
              <select
                className="SearchDialectOption SearchDialectPartsOfSpeech"
                id="searchPartOfSpeech"
                name="searchPartOfSpeech"
                onChange={this._handleCustomSearch}
                value={searchPartOfSpeech}
              >
                <option key="SEARCH_SORT_DEFAULT" value={SEARCH_SORT_DEFAULT}>
                  Any
                </option>
                {isSearchingPhrases === false && this.state.partsOfSpeechOptions}
              </select>
            </span>
          )}
        </div>
      </div>
    )
  }

  _getSearchInfo = ({
    searchByAlphabet,
    searchByCulturalNotes,
    searchByDefinitions,
    searchByMode,
    searchByTitle,
    searchByTranslations,
    searchPartOfSpeech,
    searchTerm,
  }) => {
    const { isSearchingPhrases } = this.props

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
    const _searchTerm = <strong className={getDialectClassname()}>{searchTerm}</strong>
    const messagePartsOfSpeech =
      searchPartOfSpeech !== SEARCH_SORT_DEFAULT ? ", filtered by the selected 'Parts of speech'" : ''

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
          {_searchTerm}
          {`'${messagePartsOfSpeech}`}
        </span>
      ),
      containColOne: (
        <span>
          {`Showing ${wordsOrPhrases} that contain the search term '`}
          {_searchTerm}
          {`' in the '${cols[0]}' column${messagePartsOfSpeech}`}
        </span>
      ),
      containColsTwo: (
        <span>
          {`Showing ${wordsOrPhrases} that contain the search term '`}
          {_searchTerm}
          {`' in the '${cols[0]}' and '${cols[1]}' columns${messagePartsOfSpeech}`}
        </span>
      ),
      containColsThree: (
        <span>
          {`Showing ${wordsOrPhrases} that contain the search term '`}
          {_searchTerm}
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

  _getNxqlSearchSort = () => {
    const { searchPartOfSpeech, searchTerm } = this.state
    // Default sort
    let searchSortBy = 'dc:title'

    const boolCount = this._getNxqlBoolCount()
    // if (boolCount > 0) {
    //   searchSortBy = 'dc:title'
    // }

    if (boolCount === 1 && searchPartOfSpeech !== SEARCH_SORT_DEFAULT) {
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

  _getNxqlBoolCount = () => {
    const {
      searchByCulturalNotes,
      searchByDefinitions,
      searchByTitle,
      searchByTranslations,
      searchPartOfSpeech,
    } = this.props.computeSearchDialect

    const check = {
      searchByCulturalNotes,
      searchByDefinitions,
      searchByTranslations,
      searchPartOfSpeech: searchPartOfSpeech !== SEARCH_SORT_DEFAULT,
      searchByTitle,
    }
    const boolCount =
      check.searchByTitle +
      check.searchByDefinitions +
      check.searchByTranslations +
      check.searchPartOfSpeech +
      check.searchByCulturalNotes
    return boolCount
  }

  _generateNxql = () => {
    const {
      searchByAlphabet,
      searchByCulturalNotes,
      searchByDefinitions,
      searchByMode,
      searchByTitle,
      searchByTranslations,
      searchPartOfSpeech,
      searchTerm,
    } = this.state

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
        if (searchPartOfSpeech && searchPartOfSpeech !== SEARCH_SORT_DEFAULT) {
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

  _handleCustomSearch = (evt) => {
    const { id, checked, value, type } = evt.target

    const updateState = {}

    // const searchObj = getSearchObject()
    // const updateActive = searchObj.active ? searchObj.active.split(',') : []

    // Record changes
    switch (type) {
      case 'checkbox': {
        updateState[id] = checked
        /*
        // Find in updateActive array
        const urlName = this.decoder[id]
        const entryIndex = updateActive.findIndex((setName) => setName === urlName)

        // Add if checked and not present
        if (checked === true && entryIndex === -1) {
          updateActive.push(urlName)
        }

        // Remove if not checked and is present
        if (checked === false && entryIndex !== -1) {
          updateActive.splice(entryIndex, 1)
        }

        searchObj.active = updateActive.join(',')
        */
        break
      }
      default:
        updateState[id] = value
      // searchObj[this.decoder[id]] = value
    }
    this.setState(updateState)
    // this.props.searchDialectUpdate(updateState)
  }

  _handleEnterSearch = (evt) => {
    if (evt.key === 'Enter') {
      this._handleSearch()
    }
  }

  _handleSearch = () => {
    const {
      searchByCulturalNotes,
      searchByDefinitions,
      searchByTitle,
      searchByTranslations,
      searchPartOfSpeech,
      searchTerm,
    } = this.state

    const forSearchInfo = {
      searchByAlphabet: '',
      searchByCulturalNotes,
      searchByDefinitions,
      searchByMode: SEARCH_BY_CUSTOM,
      searchByTitle,
      searchByTranslations,
      searchingDialectFilter: '',
      searchPartOfSpeech,
      searchTerm,
    }
    const forSearchDialectUpdate = Object.assign({}, forSearchInfo, {
      searchInfoOutput: this._getSearchInfo(forSearchInfo),
    })
    // Save to redux:
    this.props.searchDialectUpdate(forSearchDialectUpdate)

    // NOTE: query params on hold
    /* At the moment, word is the ancestor
    and it's handleSearch calls this._resetURLPagination()
    which comes from explore/dialect/learn/base

    _resetURLPagination removes the url params

    So we have a situation where the search params are briefly added and then removed,
    but on subsequent searches the search url params aren't removed.

    EG:
    - Page load (no url params)
    - Search initiated
    - Search URL params added
    - _resetURLPagination removes URL params
    - Search again
    - Search URL params added
    - _resetURLPagination doesn't remove URL params
    */
    // Call any ancestor fn():
    this.props.handleSearch()

    // NOTE: query params on hold
    // Update url search params
    // this.updatePushStateSearch()
  }

  _resetSearch = async () => {
    const updateState = {
      searchTerm: undefined,
      searchByMode: SEARCH_BY_DEFAULT,
      searchByAlphabet: '',
      searchByCulturalNotes: false,
      searchByTitle: true,
      searchByDefinitions: true,
      searchByTranslations: false,
      searchPartOfSpeech: SEARCH_SORT_DEFAULT,
      searchInfoOutput: null,
    }
    await this.props.searchDialectUpdate(updateState)

    // this.setState({
    //   searchInfoOutput: this._getSearchInfo(),
    // })
    this.props.resetSearch()

    // NOTE: query params on hold
    // Update url search params
    // this.updatePushStateSearch()
  }
  /*
  updatePushStateSearch = () => {
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
      urlParam,
    } = this.props.computeSearchDialect
    history.pushState(
      {
        searchByAlphabet,
        searchByCulturalNotes,
        searchByDefinitions,
        searchByMode,
        searchByTitle,
        searchByTranslations,
        searchNxqlSort,
        searchPartOfSpeech,
        searchTerm,
        urlParam,
      },
      '',
      `?${urlParam}`
    )
  }
  */
  _updateSearchTerm = (evt) => {
    this.setState({
      searchTerm: evt.target.value,
    })
  }
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
