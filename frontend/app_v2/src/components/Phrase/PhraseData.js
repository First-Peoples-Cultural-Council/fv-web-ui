import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { useHistory, useParams } from 'react-router-dom'

import useGetSite from 'common/useGetSite'
import documentApi from 'services/api/document'
import { triggerError } from 'common/navigationHelpers'
import { localDateMDYT } from 'common/stringHelpers'

/**
 * @summary PhraseData
 * @component
 *
 * @param {object} props
 *
 */
function PhraseData() {
  const { phraseId } = useParams()
  const { path } = useGetSite()
  const history = useHistory()
  const siteShortUrl = path ? path.split('/').pop() : ''

  // Data fetch
  const response = useQuery(
    ['phrase', phraseId],
    () => documentApi.get({ id: phraseId, contextParameters: 'phrase' }),
    {
      // The query will not execute until the phraseId has been provided
      enabled: !!phraseId,
    }
  )
  const { data, error, isError, isLoading } = response

  const properties = data?.properties ? data.properties : {}
  const phraseContextParams = data?.contextParameters?.phrase ? data.contextParameters.phrase : {}

  const entry = {
    title: properties['dc:title'] || '',
    docType: data?.type || '',
    translations: properties['fv:definitions'] || [],
    acknowledgement: properties['fv-phrase:acknowledgement'] || '',
    culturalNotes: properties['fv:cultural_note'] || [],
    generalNote: properties['fv:general_note'] || [],
    pronunciation: properties['fv-phrase:pronunciation'] || '',
    reference: properties['fv:reference'] || '',
    created: localDateMDYT(properties['dc:created']) || '',
    modified: localDateMDYT(properties['dc:modified']) || '',
    version: properties['uid:major_version'] || '',
    categories: phraseContextParams?.phrase_books || [],
    audio: phraseContextParams?.related_audio || [],
    relatedPhrases: phraseContextParams?.related_phrases || [],
    relatedAssets: phraseContextParams?.related_assets || [],
    pictures: phraseContextParams?.related_pictures || [],
    videos: phraseContextParams?.related_videos || [],
    sources: phraseContextParams?.sources || [],
  }

  useEffect(() => {
    if (isError) triggerError(error, history)
  }, [isError])

  return {
    phraseId,
    isLoading,
    entry: data?.title ? entry : {},
    actions: ['copy', 'share'],
    moreActions: ['copy'],
    siteShortUrl,
  }
}

export default PhraseData
