const getAlphabet = (response) => {
  const _entries = response?.entries || []
  const characters = _entries.map(({ title, uid, contextParameters }) => {
    const { character } = contextParameters
    const { related_audio: relatedAudio, related_videos: relatedVideo, related_words: relatedWords } = character
    // TODO: AUDIO Drop '/nuxeo/', it's only for dev/localhost
    const src = relatedAudio?.[0].path ? '/nuxeo/' + relatedAudio?.[0].path : undefined
    // TODO: VIDEO Drop '/nuxeo/', it's only for dev/localhost
    const videoSrc = relatedVideo?.[0].path ? '/nuxeo/' + relatedVideo?.[0].path : undefined

    const relatedEntries = relatedWords?.map((word) => {
      return {
        uid: word.uid,
        title: word['dc:title'],
        definitions: word['fv:definitions'],
        // TODO replace hardcoded audio source
        src:
          'https://dev.firstvoices.com/nuxeo/nxfile/default/15761975-8249-400c-a9e2-4a5357ca7ce9/file:content/sample1.mp3',
      }
    })
    return {
      videoSrc,
      title,
      uid,
      src,
      relatedEntries,
    }
  })

  return characters
}

export default getAlphabet
