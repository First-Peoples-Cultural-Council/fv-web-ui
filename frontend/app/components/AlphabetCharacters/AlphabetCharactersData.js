import { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ProviderHelpers from 'common/ProviderHelpers'
import selectn from 'selectn'
import { getDialectClassname } from 'common/Helpers'
// REDUX: actions/dispatch/func
import { fetchDocument } from 'reducers/document'
import { fetchCharacters } from 'reducers/fvCharacter'
import { pushWindowPath } from 'reducers/windowPath'

import NavigationHelpers from 'common/NavigationHelpers'

class AlphabetCharactersData extends Component {
  constructor(props) {
    super(props)
    this.alphabetPath = ''
    this.portalPath = ''
  }

  componentDidMount() {
    window.addEventListener('popstate', this.clickLetterIfInRouteParams)

    this.alphabetPath = `${this.props.routeParams.dialect_path}/Alphabet`
    this.portalPath = `${this.props.routeParams.dialect_path}/Portal`

    const { extractComputedCharacters } = this.returnCommonData()
    if (selectn('action', extractComputedCharacters) !== 'FV_CHARACTERS_QUERY_START') {
      ProviderHelpers.fetchIfMissing(
        this.alphabetPath,
        this.props.fetchCharacters,
        this.props.computeCharacters,
        '&currentPageIndex=0&pageSize=100&sortOrder=asc&sortBy=fvcharacter:alphabet_order'
      )
    }
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.clickLetterIfInRouteParams)
  }

  render() {
    const { extractComputedCharacters, extractComputePortal } = this.returnCommonData()
    return this.props.children({
      characters: selectn('response.entries', extractComputedCharacters),
      dialectClassName: getDialectClassname(extractComputePortal),
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

  returnCommonData = () => {
    const { computePortal, computeCharacters } = this.props
    return {
      extractComputedCharacters: ProviderHelpers.getEntry(computeCharacters, this.alphabetPath),
      extractComputePortal: ProviderHelpers.getEntry(computePortal, this.portalPath),
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
  letterClicked = ({ href, letter, updateHistory = false }) => {
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
}

AlphabetCharactersData.defaultProps = {
  letterClickedCallback: () => {},
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
}

export default connect(mapStateToProps, mapDispatchToProps)(AlphabetCharactersData)
