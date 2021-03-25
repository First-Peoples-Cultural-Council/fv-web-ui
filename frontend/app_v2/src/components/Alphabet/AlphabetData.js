import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'

//FPCC
import useGetSite from 'common/useGetSite'
import alphabetApi from 'services/api/alphabet'
/**
 * @summary AlphabetData
 * @component NB: This component is used by multiple Presentation layers
 *
 * @param {object} props
 *
 */
export const findSelectedCharacterData = ({ character, data, sitename }) => {
  const characters = data?.characters
  const found = characters.find(({ title }) => title === character)
  if (found?.relatedEntries) {
    found.relatedEntries.forEach((entry) => {
      entry.url = `/${sitename}/word/${entry.uid}`
    })
  }
  return found
}

const AlphabetData = () => {
  const { uid } = useGetSite()
  const { character, sitename } = useParams()
  const [selectedData, setSelectedData] = useState({})

  // Data fetch
  const { isLoading, error, data } = useQuery(['alphabet', uid], () => alphabetApi.get(uid), {
    // The query will not execute until the siteId exists
    enabled: !!uid,
  })

  useEffect(() => {
    if (character && data) {
      const _selectedData = findSelectedCharacterData({ character, data, sitename })
      if (_selectedData !== undefined && _selectedData?.title !== selectedData?.title) {
        setSelectedData(_selectedData)
      }
    }
  }, [character, data])

  // Video Modal
  const [videoIsOpen, setVideoIsOpen] = useState(false)

  const onCharacterClick = (clickedCharacter) => {
    const _selectedData = findSelectedCharacterData({ character: clickedCharacter, data, sitename })
    if (_selectedData !== undefined && _selectedData?.title !== selectedData?.title) {
      setSelectedData(_selectedData)
    }
  }

  const onVideoClick = () => {
    setVideoIsOpen(!videoIsOpen)
  }

  return {
    characters: data?.characters,
    links: data?.relatedLinks,
    error,
    isLoading,
    sitename,
    onCharacterClick,
    onVideoClick,
    selectedData,
    videoIsOpen,
  }
}

export default AlphabetData
