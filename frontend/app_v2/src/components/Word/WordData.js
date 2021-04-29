import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { useHistory, useLocation, useParams } from 'react-router-dom'

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
  const { uid, path } = useGetSite()
  const location = useLocation()
  const history = useHistory()
  const siteShortUrl = path ? path.split('/').pop() : ''

  // Data fetch
  const response = useQuery(
    ['search', location.search],
    () => documentApi.get({ id: wordId, contextParameters: 'word' }),
    {
      // The query will not execute until the siteId exists and a search term has been provided
      enabled: !!uid && !!wordId,
    }
  )
  const { data, error, isError, isLoading } = response

  const properties = data?.properties ? data.properties : {}

  const entry = {
    title: properties['dc:title'] || '',
    docType: data?.type || '',
    translations: properties['fv:definitions'] || [],
    literalTranslations: properties['fv:literal_translation'] || [],
    acknowledgement: properties['fv-word:acknowledgement'] || '',
    categories: properties['fv-word:categories'] || [],
    culturalNotes: properties['fv:cultural_note'] || [],
    generalNote: properties['fv:general_note'] || [],
    partOfSpeech: properties['fv-word:part_of_speech'] || '',
    pronunciation: properties['fv-word:pronunciation'] || '',
    audio: properties['fv:related_audio'] || [],
    relatedPhrases: properties['fv:related_phrases'] || [],
    relatedAssets: properties['fv:related_assets'] || [],
    pictures: properties['fv:related_pictures'] || [],
    videos: properties['fv:related_videos'] || [],
  }

  //   const relatedToAssets = selectn('contextParameters.word.related_by', wordRawData) || []

  useEffect(() => {
    if (isError) triggerError(error, history)
  }, [isError])

  return {
    wordId,
    isLoading,
    entry: data?.title ? entry : {},
    actions: ['copy'],
    moreActions: [],
    siteShortUrl,
  }
}

export default WordData
