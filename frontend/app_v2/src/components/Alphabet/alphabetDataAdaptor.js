export const alphabetDataAdaptor = (response) => {
  const _entries = response?.entries || []
  /*
  title
  uid
  contextParameters.character.related_audio[0].path
  contextParameters.character.related_entries [] -> uid, title, definitions, audio.path
  */
  const characters = _entries.map(({ title, uid, contextParameters }) => {
    const { character } = contextParameters
    const { related_audio: relatedAudio /*, related_entries: relatedEntries*/ } = character
    return {
      title,
      uid,
      src: relatedAudio?.[0].path,
      relatedEntries: [
        {
          uid: '1-2-3',
          title: 'RelatedWord',
          definitions: ['defn1', 'defn2'],
          src:
            'https://dev.firstvoices.com/nuxeo/nxfile/default/15761975-8249-400c-a9e2-4a5357ca7ce9/file:content/sample1.mp3',
        },
      ],
    }
  })
  // console.log('alphabetDataAdaptor', {response, characters})
  return characters
}
