// size only applies to images
// Values for size can be: 'Thumbnail', 'Small', 'Medium', 'FullHD', 'OriginalJpeg',
export const getMediaUrl = ({ id, type, viewName = 'Medium' }) => {
  switch (type?.substring(0, 5)) {
    case 'audio':
      return `/nuxeo/nxfile/default/${id}/file:content/`

    case 'video':
      return `/nuxeo/nxfile/default/${id}/file:content/`

    case 'image':
      return `/nuxeo/nxpicsfile/default/${id}/${viewName}:content/`

    default:
      return 'MediaTypeNotRecognised'
  }
}

// Very basic function for making strings plural - does NOT account for variations in pluralization e.g. mouse -> mice
export const makePlural = (string) => {
  const lastCharacter = string.slice(-1)
  if (lastCharacter === 'y') {
    const plural = string.slice(0, -1)
    return plural + 'ies'
  }
  if (lastCharacter === 's') {
    return string + 'es'
  }
  return string + 's'
}
