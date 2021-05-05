import { getFriendlyDocType, localDateMDYT } from 'common/stringHelpers'

function phraseDataAdaptor(data) {
  const properties = data?.properties ? data.properties : {}
  const phraseContextParams = data?.contextParameters?.phrase ? data.contextParameters.phrase : {}

  const entry = {
    id: data?.uid || '',
    type: getFriendlyDocType(data?.type) || '',
    title: properties['dc:title'] || '',
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
    audio:
      phraseContextParams?.related_audio?.map((file) => {
        return { ...file, speaker: 'Name of speaker' }
      }) || [],
    relatedPhrases: phraseContextParams?.related_phrases || [],
    relatedAssets: phraseContextParams?.related_assets || [],
    pictures: phraseContextParams?.related_pictures || [],
    videos: phraseContextParams?.related_videos || [],
    sources: phraseContextParams?.sources || [],
  }

  return entry
}

export default phraseDataAdaptor
