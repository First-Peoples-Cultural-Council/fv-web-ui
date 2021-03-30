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
