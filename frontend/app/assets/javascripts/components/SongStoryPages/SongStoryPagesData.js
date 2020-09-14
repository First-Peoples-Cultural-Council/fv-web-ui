import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'

// FPCC
import useNavigationHelpers from 'common/useNavigationHelpers'

/**
 * @summary SongStoryPagesData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 * @param {array} bookEntries the response from fetchBookEntries/computeBookEntries
 * @param {string} defaultLanguage the default language for translation/definition of the dialect
 *
 */
function SongStoryPagesData({ children, bookEntries, defaultLanguage }) {
  const { getBaseURL } = useNavigationHelpers()
  const [bookPages, setBookPages] = useState([])

  const getPages = async () => {
    const bookPagesArray = []
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
      const picturesData = selectn('contextParameters.book.related_pictures', entry) || []
      const pictures = []
      picturesData.forEach((picture, key) => {
        const img = {
          original: selectn('views[4].url', picture) || 'assets/images/cover.png',
          thumbnail: selectn('views[0].url', picture) || 'assets/images/cover.png',
          description: picture['dc:description'],
          key: key,
          uid: picture.uid,
          object: picture,
        }
        pictures.push(img)
      })

      // Audio
      const audioData = selectn('contextParameters.book.related_audio', entry) || []
      const audio = _getBookAudioVideo(audioData)

      // Videos
      const videosData = selectn('contextParameters.book.related_videos', entry) || []
      const videos = _getBookAudioVideo(videosData)

      bookPagesArray.push({
        uid: selectn('uid', entry) || '',
        title: selectn('properties.dc:title', entry) || '',
        dominantLanguageText: selectn('[0].translation', dominantLanguageText) || '',
        literalTranslation: selectn('[0].translation', literalTranslation) || '',
        audio: audio,
        pictures: pictures,
        videos: videos,
      })
    }
    setBookPages(bookPagesArray)
  }

  function _getBookAudioVideo(data) {
    const mediaArray = []
    data.forEach((doc, key) => {
      const extractedData = {
        original: getBaseURL() + doc.path,
        thumbnail: 'assets/images/cover.png',
        description: doc['dc:description'],
        key: key,
        uid: doc.uid,
        object: doc,
      }
      mediaArray.push(extractedData)
    })
    return mediaArray
  }

  useEffect(() => {
    getPages()
  }, [])

  return children({
    bookPages,
  })
}
// PROPTYPES
const { array, string } = PropTypes
SongStoryPagesData.propTypes = {
  bookEntries: array,
  defaultLanguage: string,
}

export default SongStoryPagesData
