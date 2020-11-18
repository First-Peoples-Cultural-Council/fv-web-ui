import { useState, useEffect } from 'react'
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

/**
 * @summary AlphabetCharactersData
 * @version 2.0.0
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function AlphabetCharactersData({
  children,
  computeCharacters,
  computePortal,
  letterClickedCallback,
  routeParams,
  splitWindowPath,
}) {
  const [alphabetPath, setAlphabetPath] = useState('')
  const [portalPath, setPortalPath] = useState('')

  const extractComputedCharacters = ProviderHelpers.getEntry(computeCharacters, alphabetPath)
  const extractComputePortal = ProviderHelpers.getEntry(computePortal, portalPath)

  useEffect(() => {
    window.addEventListener('popstate', clickLetterIfInRouteParams)

    setAlphabetPath(`${routeParams.dialect_path}/Alphabet`)
    setPortalPath(`${routeParams.dialect_path}/Portal`)

    if (selectn('action', extractComputedCharacters) !== 'FV_CHARACTERS_QUERY_START') {
      ProviderHelpers.fetchIfMissing(
        alphabetPath,
        fetchCharacters,
        computeCharacters,
        '&currentPageIndex=0&pageSize=100&sortOrder=asc&sortBy=fvcharacter:alphabet_order'
      )
    }
    return () => {
      window.removeEventListener('popstate', clickLetterIfInRouteParams)
    }
  }, [])

  const clickLetterIfInRouteParams = () => {
    const letter = selectn('letter', routeParams)
    if (letter) {
      letterClicked({ letter })
    }
  }

  // Used by the presentation layer to generate urls
  const generateAlphabetCharacterHref = (letter) => {
    let href = undefined
    const _splitWindowPath = [...splitWindowPath]
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
  const letterClicked = ({ href, letter, updateHistory = false }) => {
    letterClickedCallback({
      href,
      letter,
      updateHistory,
    })

    if (updateHistory === false && href) {
      NavigationHelpers.navigate(href, pushWindowPath, false)
    }
  }

  return children({
    activeLetter: routeParams.letter,
    characters: selectn('response.entries', extractComputedCharacters),
    dialectClassName: getDialectClassname(extractComputePortal),
    generateAlphabetCharacterHref: generateAlphabetCharacterHref,
    letterClicked: letterClicked,
  })
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
