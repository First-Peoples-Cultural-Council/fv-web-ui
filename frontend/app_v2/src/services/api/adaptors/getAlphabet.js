const getAlphabet = (response) => {
  const _entries = response?.entries || []
  const characters = _entries.map(({ title, uid, contextParameters }) => {
    const { character } = contextParameters
    const { related_audio: relatedAudio, related_videos: relatedVideo, related_words: relatedWords } = character

    const src = relatedAudio?.[0].path ? '/nuxeo/' + relatedAudio?.[0].path : undefined
    const videoSrc = relatedVideo?.[0].transcodedVideos[0].url ? relatedVideo?.[0].transcodedVideos[0].url : undefined
    const relatedEntries = relatedWords?.map((word) => {
      return {
        uid: word.uid,
        title: word['dc:title'],
        definitions: word['fv:definitions'],
        // Hardcoding audio source until endpoint is updated
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
  // Hardcoding links until endpoint is updated
  const links = response?.related_links || [
    {
      url: '/url/1',
      title: 'Download Alphabet Pronunciation Guide',
    },
    { url: '/url/2', title: 'Another potential related link' },
  ]

  return { characters, links }
}

export default getAlphabet
