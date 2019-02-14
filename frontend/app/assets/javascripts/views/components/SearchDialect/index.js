import React, { Component } from 'react'
import Immutable, { Set, Map } from 'immutable'
import { PropTypes } from 'react'
import {
  SEARCH_SORT_DEFAULT,
  SEARCH_BY_DEFAULT,
  SEARCH_BY_ALPHABET,
  SEARCH_BY_CATEGORY,
  SEARCH_BY_CUSTOM,
} from './constants'
import provide from 'react-redux-provide'
import StringHelpers from 'common/StringHelpers'
import selectn from 'selectn'
import classNames from 'classnames'
import RaisedButton from 'material-ui/lib/raised-button'
import IntlService from 'views/services/intl'

const intl = IntlService.instance
const { any, func, string, bool, object, number } = PropTypes

@provide
class SearchDialect extends Component {
  static propTypes = {
    computeDirectory: object.isRequired,
    fetchDirectory: func.isRequired,
    filterInfo: any, // TODO: set appropriate propType
    handleSearch: func,
    isSearchingPhrases: bool,
    resetButtonText: string,
    resetSearch: func,
    searchButtonText: string,
    searchByMode: number,
    searchByAlphabet: string,
    searchingCategory: string,
    searchByDefinitions: bool,
    searchByTitle: bool,
    searchByTranslations: bool,
    searchByCulturalNotes: bool,
    searchPartOfSpeech: string,
    searchTerm: string,
    updateAncestorState: func,
  }
  static defaultProps = {
    isSearchingPhrases: false,
    filterInfo: new Map({}),
    updateAncestorState: () => {},
    handleSearch: () => {},
    resetSearch: () => {},
    searchByMode: SEARCH_BY_DEFAULT,
    searchByAlphabet: '',
    searchByCulturalNotes: false,
    searchByTitle: true,
    searchByDefinitions: true,
    searchByTranslations: false,
    searchTerm: '',
    searchPartOfSpeech: SEARCH_SORT_DEFAULT,
  }

  constructor(props) {
    super(props)

    this.state = {
      partsOfSpeechOptions: null,
    }
    ;[
      '_getBrowse',
      '_getSearchForm',
      '_getSearchInfo',
      '_getNxqlSearchSort',
      '_getNxqlBoolCount',
      '_generateNxql',
      '_handleCustomSearch',
      '_handleEnterSearch',
      '_handleSearch',
      '_resetSearch',
      '_updateSearchTerm',
    ].forEach((method) => (this[method] = this[method].bind(this)))
  }

  componentDidMount() {
    this.props.fetchDirectory('parts_of_speech')
  }

  componentDidUpdate(prevProps) {
    const searchNxqlQuery = this._generateNxql()
    const searchNxqlSort = this._getNxqlSearchSort()
    this.props.updateAncestorState({ searchNxqlQuery, searchNxqlSort })

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

    // Determine if need to update search message
    // if (this.props.searchByMode === SEARCH_BY_ALPHABET && prevProps.searchByAlphabet !== this.props.searchByAlphabet) {
    //   console.log('!!!! componentDidUpdate SEARCH_BY_ALPHABET')
    //   // Note: aware that we are triggering a new render
    //   // eslint-disable-next-line
    //   this.setState({
    //     searchInfoOutput: this._getSearchInfo(),
    //   })
    // }

    // if (
    //   this.props.searchByMode === SEARCH_BY_CATEGORY &&
    //   prevProps.searchingCategory !== this.props.searchingCategory
    // ) {
    //   console.log('!!!! componentDidUpdate SEARCH_BY_CATEGORY')
    //   // Note: aware that we are triggering a new render
    //   // eslint-disable-next-line
    //   this.setState({
    //     searchInfoOutput: this._getSearchInfo(),
    //   })
    // }
    const updatedAlphabet =
      this.props.searchByMode === SEARCH_BY_ALPHABET && prevProps.searchByAlphabet !== this.props.searchByAlphabet
    const updatedCategory =
      this.props.searchByMode === SEARCH_BY_CATEGORY && prevProps.searchingCategory !== this.props.searchingCategory
    const updatedMode = prevProps.searchByMode !== this.props.searchByMode
    if (updatedAlphabet || updatedCategory || updatedMode) {
      // Note: aware that we are triggering a new render
      // eslint-disable-next-line
      this.setState({
        searchInfoOutput: this._getSearchInfo(),
      })
    }
  }

  render() {
    const { searchByMode } = this.props

    let searchBody = null
    if (searchByMode === SEARCH_BY_ALPHABET || searchByMode === SEARCH_BY_CATEGORY) {
      searchBody = this._getBrowse()
    } else {
      searchBody = this._getSearchForm()
    }
    return (
      <div className="SearchDialect">
        {this.state.searchInfoOutput}
        {searchBody}
      </div>
    )
  }
  _getBrowse() {
    const { searchByMode } = this.props
    let resetButtonText = ''
    if (searchByMode === SEARCH_BY_ALPHABET) {
      resetButtonText = 'Stop browsing Alphabetically'
    } else {
      resetButtonText = 'Stop browsing by Category'
    }
    return (
      <div className="SearchDialectForm">
        <RaisedButton
          label={resetButtonText}
          onTouchTap={this._resetSearch}
          primary
          // style={{ marginLeft: '20px' }}
        />
      </div>
    )
  }
  _getSearchForm() {
    const {
      isSearchingPhrases,
      searchTerm,
      searchByCulturalNotes,
      searchByTitle,
      searchByDefinitions,
      searchByTranslations,
      searchPartOfSpeech,
    } = this.props
    let searchButtonText = ''
    const resetButtonText = 'Reset search'
    let searchByTitleText = ''
    if (isSearchingPhrases) {
      searchByTitleText = 'Phrase'
      searchButtonText = 'Search'
    } else {
      searchByTitleText = 'Word'
      searchButtonText = intl.trans('views.pages.explore.dialect.learn.words.search_words', 'Search Words', 'words')
    }

    return (
      <div className="SearchDialectForm">
        <div className="SearchDialectFormPrimary">
          <input
            className="SearchDialectFormPrimaryInput"
            type="text"
            onChange={this._updateSearchTerm}
            onKeyPress={this._handleEnterSearch}
            value={searchTerm}
          />

          <RaisedButton label={searchButtonText} onTouchTap={this._handleSearch} primary />

          <RaisedButton
            label={resetButtonText}
            onTouchTap={this._resetSearch}
            primary={false}
            style={{ marginLeft: '20px' }}
          />
        </div>

        <div className="SearchDialectFormSecondary">
          <span className="SearchDialectFormSecondaryGroup">
            <input
              checked={searchByTitle}
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
              checked={searchByDefinitions}
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
                checked={searchByCulturalNotes}
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
                checked={searchByTranslations}
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

  _getSearchInfo() {
    const {
      isSearchingPhrases,
      searchByMode,
      searchByAlphabet,
      searchByCulturalNotes,
      searchByDefinitions,
      searchTerm,
      searchByTitle,
      searchByTranslations,
      searchPartOfSpeech,
    } = this.props

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
    const _searchTerm = <strong>{searchTerm}</strong>
    const messagePartsOfSpeech =
      searchPartOfSpeech !== SEARCH_SORT_DEFAULT ? ", filtered by the selected 'Parts of speech'" : ''

    const messages = {
      all: isSearchingPhrases ? (
        <span>{`Showing all ${wordsOrPhrases} listed alphabetically${messagePartsOfSpeech}`}</span>
      ) : (
        <span>{`Showing all ${wordsOrPhrases} in the dictionary listed alphabetically${messagePartsOfSpeech}`}</span>
      ),
      byCategory: <span>{`Showing all ${wordsOrPhrases} in the selected category${messagePartsOfSpeech}`}</span>,
      startWith: (
        <span>
          {`Showing ${wordsOrPhrases} that start with the letter '`}
          {searchByAlphabet}
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
      case SEARCH_BY_CUSTOM: {
        if (searchTerm === '') {
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

  _getNxqlSearchSort() {
    const { searchPartOfSpeech, searchTerm } = this.props
    // Default sort
    let searchSortBy = 'dc:title'

    const boolCount = this._getNxqlBoolCount()
    // if (boolCount > 0) {
    //   searchSortBy = 'dc:title'
    // }

    if (boolCount === 1 && searchPartOfSpeech !== SEARCH_SORT_DEFAULT) {
      searchSortBy = 'fv-word:part_of_speech'
    }

    return searchTerm
      ? {
        DEFAULT_SORT_COL: searchSortBy,
        DEFAULT_SORT_TYPE: 'asc',
      }
      : {}
  }

  _getNxqlBoolCount() {
    const {
      searchByCulturalNotes,
      searchByDefinitions,
      searchByTranslations,
      searchPartOfSpeech,
      searchByTitle,
    } = this.props

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

  _generateNxql() {
    const {
      searchTerm,
      searchByTitle,
      searchByMode,
      searchByAlphabet,
      searchByCulturalNotes,
      searchByDefinitions,
      searchByTranslations,
      searchPartOfSpeech,
    } = this.props

    const search = searchTerm || ''
    const nxqlTmpl = {
      // allFields: `ecm:fulltext = '*${StringHelpers.clean(search, 'fulltext')}*'`,
      searchByTitle: `dc:title ILIKE '%${search}%'`,
      searchByAlphabet: `dc:title ILIKE          '${searchByAlphabet}%'`,
      searchByCategory: `dc:title ILIKE '%${search}%'`,
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
          // nxqlQuerySpeech = `${nxqlQueries.length > 0 ? ' AND ' : ''} ${nxqlTmpl.searchPartOfSpeech}`
          nxqlQuerySpeech = ` AND ${nxqlTmpl.searchPartOfSpeech}`
        }
      }
    }

    // Safety
    if (nxqlQueries.length === 0) {
      nxqlQueries.push(nxqlTmpl.searchByTitle)
    }

    let nxqlQueryCollection = ''
    if (nxqlQueries.length > 0) {
      nxqlQueryCollection = `( ${nxqlQueries.join('')} )`
    }
    return `${nxqlQueryCollection}${nxqlQuerySpeech}`
  }

  _handleCustomSearch(evt) {
    const { id, checked, value, type } = evt.target

    const updateState = {}

    // Record changes
    switch (type) {
      case 'checkbox':
        updateState[id] = checked
        break
      default:
        updateState[id] = value
    }

    this.props.updateAncestorState(updateState)
  }

  _handleEnterSearch(evt) {
    if (evt.key === 'Enter') {
      this._handleSearch()
    }
  }

  _handleSearch() {
    this.setState({
      searchInfoOutput: this._getSearchInfo(),
    })
    const updateState = {
      searchByMode: SEARCH_BY_CUSTOM,
      searchTerm: this.props.searchTerm,
      searchByAlphabet: '',
      searchingCategory: '',
      // searchNxqlQuery: this._generateNxql(),
      // searchNxqlSort: this._getNxqlSearchSort(),
      // force: Math.random(),
    }
    this.props.updateAncestorState(updateState)
    this.props.handleSearch()
  }

  async _resetSearch() {
    const updateState = {
      searchTerm: null,
      searchByMode: SEARCH_BY_DEFAULT,
      searchByAlphabet: '',
      searchByCulturalNotes: false,
      searchByTitle: true,
      searchByDefinitions: true,
      searchByTranslations: false,
      searchPartOfSpeech: SEARCH_SORT_DEFAULT,
    }
    await this.props.updateAncestorState(updateState)

    this.setState({
      searchInfoOutput: this._getSearchInfo(),
    })
    this.props.resetSearch()
  }

  _updateSearchTerm(evt) {
    this.props.updateAncestorState({
      searchTerm: evt.target.value,
    })
  }
}

export { SearchDialect }
