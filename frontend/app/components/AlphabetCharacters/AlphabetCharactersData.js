import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import ProviderHelpers from 'common/ProviderHelpers'
import selectn from 'selectn'
// Data Sources
import useCharacters from 'dataSources/useCharacters'
import usePortal from 'dataSources/usePortal'
import useRoute from 'dataSources/useRoute'
// Helpers
import { getDialectClassname } from 'common/Helpers'
import useNavigationHelpers from 'common/useNavigationHelpers'
/**
 * @summary AlphabetCharactersData
 * @version 2.0.0
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function AlphabetCharactersData({ children }) {
  const [characters, setCharacters] = useState([])
  const { getSearchAsObject, navigate } = useNavigationHelpers()
  const { fetchCharacters, computeCharacters } = useCharacters()
  const { computePortal } = usePortal()
  const { routeParams } = useRoute()
  const { letter: queryLetter } = getSearchAsObject()
  const alphabetPath = `${routeParams.dialect_path}/Alphabet`
  const portalPath = `${routeParams.dialect_path}/Portal`
  const extractComputedCharacters = ProviderHelpers.getEntry(computeCharacters, alphabetPath)
  const extractComputePortal = ProviderHelpers.getEntry(computePortal, portalPath)

  useEffect(() => {
    ProviderHelpers.fetchIfMissing(
      alphabetPath,
      fetchCharacters,
      computeCharacters,
      '&currentPageIndex=0&pageSize=100&sortOrder=asc&sortBy=fvcharacter:alphabet_order'
    )
  }, [])

  const charactersUnprocessed = selectn('response.entries', extractComputedCharacters) || []
  useEffect(() => {
    const charactersProcessed = charactersUnprocessed.map(({ title }) => {
      return {
        title,
        href: `${window.location.pathname}?letter=${title}`,
        isActiveCharacter: title === decodeURIComponent(queryLetter),
      }
    })
    if (charactersProcessed.length > 0) {
      setCharacters(charactersProcessed)
    }
  }, [charactersUnprocessed, queryLetter])

  const onClick = (href) => {
    navigate(href)
  }

  return children({
    characters,
    dialectClassName: getDialectClassname(extractComputePortal),
    onClick,
  })
}

// PROPTYPES
const { func } = PropTypes
AlphabetCharactersData.propTypes = {
  children: func,
}

export default AlphabetCharactersData
