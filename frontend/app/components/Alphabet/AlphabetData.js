import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'

// FPCC
import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'

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
function AlphabetData({ children }) {
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

  const [currentChar, setCurrentChar] = useState({})

  useEffect(() => {
    // Trigger audio to play
    const charElement = document.getElementById(currentChar.audioPath)
    if (charElement) {
      if (charElement.fireEvent) {
        charElement.fireEvent('onclick')
      } else {
        const evObj = document.createEvent('Events')
        evObj.initEvent('click', true, false)
        charElement.dispatchEvent(evObj)
      }
    }
  }, [currentChar])

  const characters = rawCharacters
    ? rawCharacters.map((char) => {
        const audio = selectn('contextParameters.character.related_audio[0].path', char)
        return {
          uid: char.uid,
          title: char.title,
          audioPath: audio ? NavigationHelpers.getBaseURL() + audio : null,
          path: char.path,
          upperCase: selectn('properties.fvcharacter:upper_case_character', char) || null,
          relatedWord: selectn('contextParameters.character.related_words[0].dc:title', char) || null,
          relatedDefinition:
            selectn('contextParameters.character.related_words[0].fv:definitions[0].translation', char) ||
            selectn('contextParameters.character.related_words[0].fv:literal_translation[0].translation', char) ||
            null,
        }
      })
    : null

  const onCharacterClick = (character) => {
    // Set currentChar and trigger reveal of characterLink
    if (character !== currentChar) {
      setCurrentChar(character)
    }
  }

  const onCharacterLinkClick = () => {
    const newPathArray = splitWindowPath.slice()
    newPathArray.push(currentChar.title)
    pushWindowPath('/' + newPathArray.join('/'))
  }

  return children({
    characters,
    currentChar,
    intl,
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
