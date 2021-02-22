import { useEffect, useState } from 'react'
import api from 'services/api'
import { alphabetDataAdaptor } from 'components/Alphabet/alphabetDataAdaptor'
import useGetSections from 'common/useGetSections'
import { useParams } from 'react-router-dom'
/**
 * @summary AlphabetData
 * @component
 *
 * @param {object} props
 *
 */
export const findSelectedCharacterData = ({ character, data }) => {
  return data.find(({ title }) => title === character)
}
const AlphabetData = () => {
  const { title } = useGetSections()
  const [selectedData, setSelectedData] = useState({})
  const { character, language } = useParams()
  const { isLoading, error, data } = api.postAlphabet(title, alphabetDataAdaptor)
  useEffect(() => {
    if (character && data) {
      const relatedEntries = findSelectedCharacterData({ character, data })
      if (relatedEntries && selectedData?.title !== character) {
        setSelectedData(relatedEntries)
      }
    }
  }, [character, data, selectedData])
  return {
    isLoading,
    error,
    data,
    language,
    selectedData,
  }
}

export default AlphabetData
