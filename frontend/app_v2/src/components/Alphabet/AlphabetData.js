import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useQuery } from 'react-query'

//FPCC
import useGetSite from 'common/useGetSite'
import api from 'services/api'
import { getMediaUrl } from 'common/urlHelpers'
import { triggerError } from 'common/navigationHelpers'
/**
 * @summary AlphabetData
 * @component
 *
 * @param {object} props
 *
 */

const AlphabetData = ({ widgetView }) => {
  const { uid } = useGetSite()
  const { character, sitename } = useParams()
  const [selectedData, setSelectedData] = useState({})
  const history = useHistory()

  // Data fetch
  const response = useQuery(['alphabet', uid], () => api.alphabet.get(uid), {
    // The query will not execute until the siteId exists
    enabled: !!uid,
  })
  const { status, isLoading, error, isError, data } = response

  // Find slected character data and manipulate for presentation layer
  const findSelectedCharacterData = (selectedCharacter) => {
    const characters = Object.assign([], data?.characters)
    const found = characters.filter(function findChar(char) {
      return char.title === selectedCharacter
    })[0]
    if (found?.relatedWords.length > 0) {
      found.relatedWords.forEach((word) => {
        const audio = word.relatedAudio?.[0] || {}
        word.audioUrl = getMediaUrl({ id: audio?.id, type: 'audio' })
        word.url = `/${sitename}/word/${word.id}`
      })
    }
    if (found?.relatedAudio.length > 0) {
      const audio = found.relatedAudio?.[0]
      found.audioUrl = getMediaUrl({ id: audio.id, type: 'audio' })
    }
    if (found?.relatedVideo.length > 0) {
      const video = found.relatedVideo?.[0]
      found.videoUrl = getMediaUrl({ id: video.id, type: 'video' })
    }
    return found ? found : null
  }

  useEffect(() => {
    if (character && data && status === 'success' && !isError) {
      const _selectedData = findSelectedCharacterData(character)
      if (_selectedData !== undefined && _selectedData?.title !== selectedData?.title) {
        setSelectedData(_selectedData)
      }
    }
    if (isError && !widgetView) triggerError(error, history)
  }, [character, status, isError])

  // Video Modal
  const [videoIsOpen, setVideoIsOpen] = useState(false)

  const onCharacterClick = (clickedCharacter) => {
    const _selectedData = findSelectedCharacterData(clickedCharacter)
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
    isLoading: isLoading || status === 'idle' || isError,
    sitename,
    onCharacterClick,
    onVideoClick,
    selectedData,
    videoIsOpen,
  }
}

export default AlphabetData
