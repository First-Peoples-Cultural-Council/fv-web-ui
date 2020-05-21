import { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ProviderHelpers from 'common/ProviderHelpers'
import selectn from 'selectn'
import { getDialectClassname } from 'views/pages/explore/dialect/helpers'
// REDUX: actions/dispatch/func
import { fetchDocument } from 'providers/redux/reducers/document'
import { fetchCharacters } from 'providers/redux/reducers/fvCharacter'
import { searchDialectUpdate } from 'providers/redux/reducers/searchDialect'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

import { SEARCH_PART_OF_SPEECH_ANY, SEARCH_BY_ALPHABET } from 'views/components/SearchDialect/constants'
import NavigationHelpers from 'common/NavigationHelpers'

class AlphabetCharactersData extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  async componentDidMount() {
    window.addEventListener('popstate', this.clickLetterIfInRouteParams)

    const { routeParams, computePortal } = this.props
    const path = `${routeParams.dialect_path}/Alphabet`
    await ProviderHelpers.fetchIfMissing(
      path,
      this.props.fetchCharacters,
      this.props.computeCharacters,
      '&currentPageIndex=0&pageSize=100&sortOrder=asc&sortBy=fvcharacter:alphabet_order'
    )
    const extractComputedCharacters = ProviderHelpers.getEntry(this.props.computeCharacters, path)
    const characters = selectn('response.entries', extractComputedCharacters)
    const extractComputePortal = ProviderHelpers.getEntry(computePortal, `${routeParams.dialect_path}/Portal`)
    const dialectClassName = getDialectClassname(extractComputePortal)

    this.setState(
      {
        characters,
        dialectClassName,
      },
      () => {
        this.clickLetterIfInRouteParams()
      }
    )
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.clickLetterIfInRouteParams)
  }

  render() {
    const { characters, dialectClassName } = this.state
    return this.props.children({
      characters,
      dialectClassName,
      generateAlphabetCharacterHref: this.generateAlphabetCharacterHref,
      activeLetter: this.props.routeParams.letter,
      letterClicked: this.letterClicked,
      splitWindowPath: this.props.splitWindowPath,
    })
  }

  clickLetterIfInRouteParams = () => {
    const letter = selectn('letter', this.props.routeParams)
    if (letter) {
      this.letterClicked({ letter })
    }
  }

  // Used by the presentation layer to generate urls
  generateAlphabetCharacterHref = (letter) => {
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

  // Called from the presentation layer when a letter is clicked
  letterClicked = async ({ href, letter, updateHistory = false }) => {
    await this.props.searchDialectUpdate({
      searchByAlphabet: letter,
      searchByMode: SEARCH_BY_ALPHABET,
      searchBySettings: {
        searchByDefinitions: false,
        searchByTitle: true,
        searchByTranslations: false,
        searchPartOfSpeech: SEARCH_PART_OF_SPEECH_ANY,
      },
      searchTerm: '',
    })

    this.props.letterClickedCallback({
      href,
      letter,
      updateHistory,
    })

    if (updateHistory === false && href) {
      NavigationHelpers.navigate(href, this.props.pushWindowPath, false)
    }
  }
}

// PROPTYPES
const { any, array, func, object } = PropTypes
AlphabetCharactersData.propTypes = {
  children: any,
  letterClickedCallback: func,
  // REDUX: reducers/state
  computeCharacters: object.isRequired,
  computeLogin: object.isRequired,
  computePortal: object.isRequired,
  routeParams: object.isRequired,
  splitWindowPath: array.isRequired,
  // REDUX: actions/dispatch/func
  fetchCharacters: func.isRequired,
  fetchDocument: func.isRequired,
  pushWindowPath: func.isRequired,
  searchDialectUpdate: func,
}

AlphabetCharactersData.defaultProps = {
  letterClickedCallback: () => {},
  searchDialectUpdate: () => {},
}

// REDUX: reducers/state
const mapStateToProps = (state) => {
  const { fvCharacter, fvPortal, navigation, nuxeo, windowPath } = state
  const { computePortal } = fvPortal
  const { route } = navigation
  const { computeLogin } = nuxeo
  const { computeCharacters } = fvCharacter
  const { splitWindowPath } = windowPath
  return {
    computePortal,
    computeCharacters,
    computeLogin,
    routeParams: route.routeParams,
    splitWindowPath,
  }
}
// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDocument,
  fetchCharacters,
  pushWindowPath,
  searchDialectUpdate,
}

export default connect(mapStateToProps, mapDispatchToProps)(AlphabetCharactersData)
