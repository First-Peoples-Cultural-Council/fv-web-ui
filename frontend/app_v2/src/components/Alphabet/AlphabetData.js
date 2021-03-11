import { useEffect, useState } from 'react'
import api from 'services/api'
import getAlphabetAdaptor from 'services/api/adaptors/getAlphabet'
import useGetSections from 'common/useGetSections'
import { useParams } from 'react-router-dom'
/**
 * @summary AlphabetData
 * @component NB: This component is used by multiple Presentation layers
 *
 * @param {object} props
 *
 */
export const findSelectedCharacterData = ({ character, data, language }) => {
  const characters = data?.characters
  const found = characters.find(({ title }) => title === character)
  if (found?.relatedEntries) {
    found.relatedEntries.forEach((entry) => {
      entry.url = `/${language}/word/${entry.uid}`
    })
  }
  return found
}

const AlphabetData = () => {
  const { title } = useGetSections()
  const { character, language } = useParams()
  const { isLoading, error, data } = api.getAlphabet(title, getAlphabetAdaptor)
  const [selectedData, setSelectedData] = useState({})

  useEffect(() => {
    if (character && data) {
      const _selectedData = findSelectedCharacterData({ character, data, language })
      if (_selectedData !== undefined && _selectedData?.title !== selectedData?.title) {
        setSelectedData(_selectedData)
      }
    }
  }, [character, data])

  // Video Modal
  const [videoIsOpen, setVideoIsOpen] = useState(false)

  const onCharacterClick = (clickedCharacter) => {
    const _selectedData = findSelectedCharacterData({ character: clickedCharacter, data, language })
    if (_selectedData !== undefined && _selectedData?.title !== selectedData?.title) {
      setSelectedData(_selectedData)
    }
  }

  const onVideoClick = () => {
    setVideoIsOpen(!videoIsOpen)
  }

  return {
    characters: data?.characters,
    links: data?.links,
    error,
    isLoading,
    language,
    onCharacterClick,
    onVideoClick,
    selectedData,
    videoIsOpen,
  }
}

export default AlphabetData
