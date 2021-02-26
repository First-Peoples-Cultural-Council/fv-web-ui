const getCharacter = (response) => {
  const { contextParameters } = response
  const { character } = contextParameters
  const characterData = {
    relatedEntries: character.related_words,
    relatedVideos: character.related_videos,
    relatedAudio: character.related_audio,
  }
  return characterData
}

export default getCharacter
