import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { useHistory, useParams } from 'react-router-dom'

import useGetSite from 'common/useGetSite'
import documentApi from 'services/api/document'
import { triggerError } from 'common/navigationHelpers'

/**
 * @summary WordData
 * @component
 *
 * @param {object} props
 *
 */
function WordData() {
  const { wordId } = useParams()
  const { path } = useGetSite()
  const history = useHistory()
  const siteShortUrl = path ? path.split('/').pop() : ''

  // Data fetch
  const response = useQuery(['word', wordId], () => documentApi.get({ id: wordId, contextParameters: 'word' }), {
    // The query will not execute until the wordId has been provided
    enabled: !!wordId,
  })
  const { data, error, isError, isLoading } = response

  const properties = data?.properties ? data.properties : {}
  const wordContextParams = data?.contextParameters?.word ? data.contextParameters.word : {}

  const entry = {
    title: properties['dc:title'] || '',
    docType: data?.type || '',
    translations: properties['fv:definitions'] || [],
    literalTranslations: properties['fv:literal_translation'] || [],
    acknowledgement: properties['fv-word:acknowledgement'] || '',
    culturalNotes: properties['fv:cultural_note'] || [],
    generalNote: properties['fv:general_note'] || [],
    partOfSpeech: properties['fv-word:part_of_speech'] || '',
    pronunciation: properties['fv-word:pronunciation'] || '',
    categories: wordContextParams?.categories || [],
    audio: wordContextParams?.related_audio || [],
    relatedPhrases: wordContextParams?.related_phrases || [],
    relatedAssets: wordContextParams?.related_assets || [],
    pictures: wordContextParams?.related_pictures || [],
    videos: wordContextParams?.related_videos || [],
  }

  //   const relatedToAssets = selectn('contextParameters.word.related_by', wordRawData) || []

  useEffect(() => {
    if (isError) triggerError(error, history)
  }, [isError])

  return {
    wordId,
    isLoading,
    entry: data?.title ? entry : {},
    actions: ['copy', 'share'],
    moreActions: ['copy'],
    siteShortUrl,
  }
}

export default WordData
