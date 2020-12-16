import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'

// FPCC
import ProviderHelpers from 'common/ProviderHelpers'
import { SECTIONS } from 'common/Constants'

// DataSources
import useCharacters from 'dataSources/useCharacters'
import useIntl from 'dataSources/useIntl'
import useProperties from 'dataSources/useProperties'
import useRoute from 'dataSources/useRoute'
import useWindowPath from 'dataSources/useWindowPath'

/**
 * @summary AlphabetData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function AlphabetData({ children, dialect }) {
  const { computeCharacters, fetchCharacters } = useCharacters()
  const { intl } = useIntl()
  const { properties } = useProperties()
  const { routeParams } = useRoute()
  const { pushWindowPath, splitWindowPath } = useWindowPath()

  const fetchData = () => {
    fetchCharacters(routeParams.dialect_path + '/Alphabet', '&sortOrder=asc&sortBy=fvcharacter:alphabet_order')
  }

  useEffect(() => {
    fetchData()
  }, [])

  const _computeCharacters = ProviderHelpers.getEntry(computeCharacters, routeParams.dialect_path + '/Alphabet')

  const rawCharacters = selectn('response.entries', _computeCharacters)
  const dialectName = selectn('response.title', dialect.compute)

  const [currentChar, setCurrentChar] = useState({})

  const characters = rawCharacters
    ? rawCharacters.map((char) => {
        return {
          uid: char.uid,
          title: char.title,
          audio: selectn('contextParameters.character.related_audio[0].path', char),
          path: char.path,
        }
      })
    : null

  const onCharacterClick = (character) => {
    const charElement = document.getElementById('charAudio' + character.uid)
    if (charElement) {
      document.getElementById('charAudio' + character.uid).play()
    }
    setCurrentChar(character)
  }

  const onCharacterLinkClick = () => {
    const newPathArray = splitWindowPath.slice()
    newPathArray.push(currentChar.title)
    pushWindowPath('/' + newPathArray.join('/'))
  }

  return children({
    characters,
    currentChar,
    dialectName,
    intl,
    isSections: routeParams.area === SECTIONS,
    onCharacterClick,
    onCharacterLinkClick,
    properties,
  })
}
// PROPTYPES
const { func } = PropTypes
AlphabetData.propTypes = {
  children: func,
}

export default AlphabetData
