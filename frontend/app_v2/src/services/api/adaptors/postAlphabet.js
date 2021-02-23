const postAlphabet = (response) => {
  const _entries = response?.entries || []
  const characters = _entries.map(({ title, uid, contextParameters }) => {
    const { character } = contextParameters
    const { related_audio: relatedAudio, related_video: relatedVideo /*, related_entries: relatedEntries*/ } = character
    // TODO: AUDIO Drop '/nuxeo/', it's only for dev/localhost
    const src = relatedAudio?.[0].path ? '/nuxeo/' + relatedAudio?.[0].path : undefined
    // TODO: VIDEO Drop '/nuxeo/', it's only for dev/localhost
    const videoSrc = relatedVideo?.[0].path ? '/nuxeo/' + relatedVideo?.[0].path : undefined
    return {
      videoSrc,
      title,
      uid,
      src,
      relatedEntries: [
        // TODO: Pull from related_entries
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
  return characters
}

export default postAlphabet
