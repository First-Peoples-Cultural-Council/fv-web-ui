import React, { Component } from 'react'
// import Immutable, { Set, Map } from 'immutable'
import { PropTypes } from 'react'
import provide from 'react-redux-provide'
// import StringHelpers from 'common/StringHelpers'
import selectn from 'selectn'
// import classNames from 'classnames'
import IntlService from 'views/services/intl'
import ProviderHelpers from 'common/ProviderHelpers'
import { getDialectClassname } from 'views/pages/explore/dialect/helpers'
const { any, func, string, bool, object, number } = PropTypes
const intl = IntlService.instance

@provide
class AlphabetListView extends Component {
  static propTypes = {
    handleClick: func,
    routeParams: object.isRequired,
    dialect: any.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    computeCharacters: PropTypes.object.isRequired, // via provide
    computePortal: PropTypes.object.isRequired, // via provide
    fetchDialect2: PropTypes.func.isRequired,
    fetchCharacters: PropTypes.func.isRequired,
    letter: PropTypes.string,
  }
  static defaultProps = {
    handleClick: () => {},
  }

  _isMounted = false

  constructor(props) {
    super(props)

    this.state = {
      renderCycle: 0,
    }
    ;['_generateTiles', '_generateDialectFilterUrl', '_handleHistoryEvent'].forEach(
      (method) => (this[method] = this[method].bind(this))
    )
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
  componentWillUnmount() {
    this._isMounted = false
    window.removeEventListener('popstate', this._handleHistoryEvent)
  }
  _handleHistoryEvent() {
    if (this._isMounted) {
      const _letter = selectn('letter', this.props.routeParams)
      if (_letter) {
        this.props.handleClick(_letter, false)
      }
    }
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

  render() {
    const { renderCycle } = this.state
    const content = renderCycle !== 0 ? this._generateTiles() : null
    return <div className="AlphabetListView">{content}</div>
  }

  _generateDialectFilterUrl(letter) {
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

  _generateTiles() {
    const { entries } = this.state
    const { letter } = this.props
    const _entries = (entries || []).map((value, index) => {
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
      content = (
        <div>
          <h2>
            {intl.trans('views.pages.explore.dialect.learn.words.find_by_alphabet', 'Browse Alphabetically', 'words')}
          </h2>
          <div className={`AlphabetListViewTiles ${this.state.dialectClassName}`}>{_entries}</div>
        </div>
      )
    }
    return content
  }
}

export { AlphabetListView }
