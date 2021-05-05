import { getFriendlyDocType, localDateMDYT } from 'common/stringHelpers'

function wordDataAdaptor(data) {
  const properties = data?.properties ? data.properties : {}
  const wordContextParams = data?.contextParameters?.word ? data.contextParameters.word : {}
  const entry = {
    id: data?.uid || '',
    type: getFriendlyDocType(data?.type) || '',
    title: properties['dc:title'] || '',
    translations: properties['fv:definitions'] || [],
    literalTranslations: properties['fv:literal_translation'] || [],
    acknowledgement: properties['fv-word:acknowledgement'] || '',
    culturalNotes: properties['fv:cultural_note'] || [],
    generalNote: properties['fv:general_note'] || [],
    partOfSpeech: properties['fv-word:part_of_speech'] || '',
    pronunciation: properties['fv-word:pronunciation'] || '',
    reference: properties['fv:reference'] || '',
    created: localDateMDYT(properties['dc:created']) || '',
    modified: localDateMDYT(properties['dc:modified']) || '',
    version: properties['uid:major_version'] || '',
    categories: wordContextParams?.categories || [],
    audio:
      wordContextParams?.related_audio?.map((file) => {
        return { ...file, speaker: 'Name of speaker' }
      }) || [],
    relatedPhrases: wordContextParams?.related_phrases || [],
    relatedAssets: wordContextParams?.related_assets || [],
    pictures: wordContextParams?.related_pictures || [],
    videos: wordContextParams?.related_videos || [],
    sources: wordContextParams?.sources || [],
  }

  return entry
}

export default wordDataAdaptor
