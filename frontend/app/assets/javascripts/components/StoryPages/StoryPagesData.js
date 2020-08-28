import PropTypes from 'prop-types'
import selectn from 'selectn'

// FPCC
import NavigationHelpers from 'common/NavigationHelpers'

/**
 * @summary StoryPagesData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 * @param {array} bookEntries the response from fetchBookEntries/computeBookEntries
 * @param {string} defaultLanguage the default language for translation/definition of the dialect
 *
 */
function StoryPagesData({ children, bookEntries, defaultLanguage }) {
  const bookPages = []
  bookEntries.forEach(createPage)

  function createPage(entry) {
    const dominantLanguageText = (selectn('properties.fvbookentry:dominant_language_text', entry) || []).filter(
      function getTranslation(translation) {
        return translation.language === defaultLanguage
      }
    )
    const literalTranslation = (selectn('properties.fv:literal_translation', entry) || []).filter(
      function getTranslation(translation) {
        return translation.language === defaultLanguage
      }
    )

    // Images
    const imagesData = selectn('contextParameters.book.related_pictures', entry) || []
    const images = []
    imagesData.forEach((image, key) => {
      const img = {
        original: selectn('views[2].url', image),
        thumbnail: selectn('views[0].url', image) || 'assets/images/cover.png',
        description: image['dc:description'],
        key: key,
        uid: image.uid,
        object: image,
      }
      images.push(img)
    })

    // Audio
    const audioData = selectn('contextParameters.book.related_audio', entry) || []
    const audio = _getMediaArray(audioData)

    // Videos
    const videosData = selectn('contextParameters.book.related_videos', entry) || []
    const videos = _getMediaArray(videosData)

    bookPages.push({
      uid: selectn('uid', entry) || '',
      title: selectn('properties.dc:title', entry) || '',
      dominantLanguageText: selectn('[0].translation', dominantLanguageText) || '',
      literalTranslation: selectn('[0].translation', literalTranslation) || '',
      audio: audio,
      images: images,
      videos: videos,
    })
  }

  function _getMediaArray(data) {
    const mediaArray = []
    data.forEach((doc, key) => {
      const extractedData = {
        original: NavigationHelpers.getBaseURL() + doc.path,
        thumbnail: selectn('views[0].url', doc) || 'assets/images/cover.png',
        description: doc['dc:description'],
        key: key,
        uid: doc.uid,
        object: doc,
      }
      mediaArray.push(extractedData)
    })
    return mediaArray
  }

  return children({
    bookPages,
  })
}
// PROPTYPES
const { array, string } = PropTypes
StoryPagesData.propTypes = {
  bookEntries: array,
  defaultLanguage: string,
}

export default StoryPagesData
