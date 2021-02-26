import { useEffect, useState } from 'react'
import api from 'services/api'
import getAlphabetAdaptor from 'services/api/adaptors/getAlphabet'
import useGetSections from 'common/useGetSections'
import { useParams } from 'react-router-dom'
/**
 * @summary AlphabetData
 * @component
 *
 * @param {object} props
 *
 */
export const findSelectedCharacterData = ({ character, data, language }) => {
  const found = data.find(({ title }) => title === character)
  if (found?.relatedEntries) {
    found.relatedEntries.forEach((entry) => {
      entry.url = `/${language}/word/${entry.uid}`
    })
  }
  return found
}
// NOTE: `testingChar` is only for Jest tests and shouldn't influence the website experience
const AlphabetData = (testingChar) => {
  const { title } = useGetSections()
  const { character, language } = useParams()
  const { isLoading, error, data } = api.getAlphabet(title, getAlphabetAdaptor)

  // NOTE: `defaultSelectedData` is here for Jest testing
  const defaultSelectedData = testingChar
    ? findSelectedCharacterData({ character: testingChar, data, language })
    : undefined
  const [selectedData, setSelectedData] = useState(defaultSelectedData)

  useEffect(() => {
    if (character && data) {
      const relatedEntries = findSelectedCharacterData({ character, data, language })
      if (relatedEntries && selectedData?.title !== character) {
        setSelectedData(relatedEntries)
      }
    }
  }, [character, data, selectedData])

  return {
    links: [
      {
        url: '/url/1',
        title: 'Download Alphabet Pronunciation Guide',
      },
      { url: '/url/2', title: 'Other links tbd' },
    ],
    data,
    error,
    isLoading,
    language,
    selectedData,
  }
}

export default AlphabetData
