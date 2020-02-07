import React, { Component } from 'react'
import PropTypes from 'prop-types'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'

import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'

import selectn from 'selectn'
import IntlService from 'views/services/intl'
const { func, object } = PropTypes
const intl = IntlService.instance

// TODO: REFACTOR
// - drop the renderCycle system
// - convert to hooks
// - move component states to their own methods: loading, no results, results, endpoint down/xhr error
export class AlphabetListView extends Component {
  static propTypes = {
    handleClick: func,
    letter: PropTypes.string,
    // REDUX: reducers/state
    routeParams: object.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    // REDUX: actions/dispatch/func
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
  }

  componentWillUnmount() {
    this._isMounted = false
    window.removeEventListener('popstate', this._handleHistoryEvent)
  }

  render() {
    const content =
      this.props.characters === undefined ? (
        <div className="AlphabetListView__loading">
          <CircularProgress className="AlphabetListView__loadingSpinner" color="secondary" mode="indeterminate" />
          <Typography className="AlphabetListView__loadingText" variant="caption">
            Loading characters
          </Typography>
        </div>
      ) : (
        this._generateTiles()
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
    const { characters = [] } = this.props
    const { letter } = this.props

    if (characters.length === 0) {
      return (
        <Typography className="AlphabetListView__noCharacters" variant="caption">
          Characters are unavailable at this time
        </Typography>
      )
    }

    const _characters = characters.map((value, index) => {
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
    if (_characters.length > 0) {
      content = <div className={`AlphabetListViewTiles ${this.props.dialectClassName}`}>{_characters}</div>
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
  const { navigation, windowPath } = state

  const { route } = navigation
  const { splitWindowPath } = windowPath

  return {
    routeParams: route.routeParams,
    splitWindowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDialect2,
}

export default connect(mapStateToProps, mapDispatchToProps)(AlphabetListView)
