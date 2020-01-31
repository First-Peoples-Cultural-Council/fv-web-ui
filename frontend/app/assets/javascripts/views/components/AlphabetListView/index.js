import React, { Component } from 'react'
import PropTypes from 'prop-types'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { fetchCharacters } from 'providers/redux/reducers/fvCharacter'

import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'

import selectn from 'selectn'
import IntlService from 'views/services/intl'
import ProviderHelpers from 'common/ProviderHelpers'
import { getDialectClassname } from 'views/pages/explore/dialect/helpers'
const { any, func, object } = PropTypes
const intl = IntlService.instance

// TODO: REFACTOR
// - drop the renderCycle system
// - convert to hooks
// - move component states to their own methods: loading, no results, results, endpoint down/xhr error
export class AlphabetListView extends Component {
  static propTypes = {
    dialect: any,
    handleClick: func,
    letter: PropTypes.string,
    // REDUX: reducers/state
    computeCharacters: PropTypes.object.isRequired,
    computePortal: PropTypes.object.isRequired,
    routeParams: object.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    // REDUX: actions/dispatch/func
    fetchCharacters: PropTypes.func.isRequired,
    fetchDialect2: PropTypes.func.isRequired,
  }
  static defaultProps = {
    handleClick: () => {},
    fetchCharacters: () => {},
  }

  _isMounted = false

  constructor(props) {
    super(props)

    this.state = {
      renderCycle: 0,
    }
  }

  async componentDidMount() {
    this._isMounted = true
    window.addEventListener('popstate', this._handleHistoryEvent)

    const { routeParams } = this.props
    await ProviderHelpers.fetchIfMissing(routeParams.dialect_path, this.props.fetchDialect2)
    const _pageIndex = 0
    const _pageSize = 100
    await this.props.fetchCharacters(
      `${routeParams.dialect_path}/Alphabet`,
      `&currentPageIndex=${_pageIndex}&pageSize=${_pageSize}&sortOrder=asc&sortBy=fvcharacter:alphabet_order`
    )

    const computedCharacters = await ProviderHelpers.getEntry(
      this.props.computeCharacters,
      `${routeParams.dialect_path}/Alphabet`
    )

    const computePortal = await ProviderHelpers.getEntry(this.props.computePortal, `${routeParams.dialect_path}/Portal`)

    const entries = selectn('response.entries', computedCharacters)

    this.setState({
      renderCycle: this.state.renderCycle + 1,
      entries,
      dialectClassName: getDialectClassname(computePortal),
    })
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.dialect === undefined && this.props.dialect) {
      const { routeParams } = this.props
      await ProviderHelpers.fetchIfMissing(routeParams.dialect_path, this.props.fetchDialect2)
      const _pageIndex = 0
      const _pageSize = 100
      await this.props.fetchCharacters(
        `${routeParams.dialect_path}/Alphabet`,
        `&currentPageIndex=${_pageIndex}&pageSize=${_pageSize}&sortOrder=asc&sortBy=fvcharacter:alphabet_order`
      )

      const computedCharacters = await ProviderHelpers.getEntry(
        this.props.computeCharacters,
        `${routeParams.dialect_path}/Alphabet`
      )
      const computePortal = await ProviderHelpers.getEntry(
        this.props.computePortal,
        `${routeParams.dialect_path}/Portal`
      )

      const entries = selectn('response.entries', computedCharacters)

      this.setState({
        renderCycle: this.state.renderCycle + 1,
        entries,
        dialectClassName: getDialectClassname(computePortal),
      })
    }
    if (prevProps.letter === undefined && this.props.letter) {
      this.setState({
        renderCycle: this.state.renderCycle + 1,
      })
    }
  }

  componentWillUnmount() {
    this._isMounted = false
    window.removeEventListener('popstate', this._handleHistoryEvent)
  }

  render() {
    const { renderCycle } = this.state
    const content =
      renderCycle !== 0 ? (
        this._generateTiles()
      ) : (
        <div className="AlphabetListView__loading">
          <CircularProgress className="AlphabetListView__loadingSpinner" color="secondary" mode="indeterminate" />
          <Typography className="AlphabetListView__loadingText" variant="caption">
            Loading characters
          </Typography>
        </div>
      )
    return (
      <div className="AlphabetListView" data-testid="AlphabetListView">
        <h2>
          {intl.trans('views.pages.explore.dialect.learn.words.find_by_alphabet', 'Browse Alphabetically', 'words')}
        </h2>
        {content}
      </div>
    )
  }

  _generateDialectFilterUrl = (letter) => {
    let href = undefined
    const _splitWindowPath = [...this.props.splitWindowPath]
    const wordOrPhraseIndex = _splitWindowPath.findIndex((element) => {
      return element === 'words' || element === 'phrases'
    })
    if (wordOrPhraseIndex !== -1) {
      _splitWindowPath.splice(wordOrPhraseIndex + 1)
      href = `/${_splitWindowPath.join('/')}/alphabet/${letter}`
    }
    return href
  }

  _generateTiles = () => {
    const { entries = [] } = this.state
    const { letter } = this.props

    if (entries.length === 0) {
      return (
        <Typography className="AlphabetListView__noCharacters" variant="caption">
          Characters are unavailable at this time
        </Typography>
      )
    }

    const _entries = entries.map((value, index) => {
      const _letter = value.title
      const href = this._generateDialectFilterUrl(_letter)
      return (
        <a
          href={href}
          className={`AlphabetListViewTile ${letter === _letter ? 'AlphabetListViewTile--active' : ''}`}
          onClick={(e) => {
            e.preventDefault()
            this.props.handleClick(_letter, href)
          }}
          key={index}
        >
          {_letter}
        </a>
      )
    })
    let content = null
    if (_entries.length > 0) {
      content = <div className={`AlphabetListViewTiles ${this.state.dialectClassName}`}>{_entries}</div>
    }
    return content
  }

  _handleHistoryEvent = () => {
    if (this._isMounted) {
      const _letter = selectn('letter', this.props.routeParams)
      if (_letter) {
        this.props.handleClick(_letter, false)
      }
    }
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvCharacter, fvPortal, navigation, windowPath } = state

  const { computeCharacters } = fvCharacter
  const { computePortal } = fvPortal
  const { route } = navigation
  const { splitWindowPath } = windowPath

  return {
    computeCharacters,
    computePortal,
    routeParams: route.routeParams,
    splitWindowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchCharacters,
  fetchDialect2,
}

export default connect(mapStateToProps, mapDispatchToProps)(AlphabetListView)
