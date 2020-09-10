import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'
import Immutable from 'immutable'
import DOMPurify from 'dompurify'

// FPCC
import useBook from 'DataSource/useBook'
import useDialect from 'DataSource/useDialect'
import useIntl from 'DataSource/useIntl'
import useLogin from 'DataSource/useLogin'
import useNavigation from 'DataSource/useNavigation'
import useNavigationHelpers from 'common/useNavigationHelpers'
import useProperties from 'DataSource/useProperties'
import useRoute from 'DataSource/useRoute'
import useWindowPath from 'DataSource/useWindowPath'

import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'

/**
 * @summary SongStoryData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function SongStoryData({ children }) {
  const { computeBook, computeBookEntries, deleteBook, fetchBook, fetchBookEntries, publishBook } = useBook()
  const { fetchDialect2, computeDialect2 } = useDialect()
  const { intl } = useIntl()
  const { computeLogin } = useLogin()
  const { changeTitleParams, overrideBreadcrumbs } = useNavigation()
  const { getBaseURL } = useNavigationHelpers()
  const { properties } = useProperties()
  const { routeParams } = useRoute()
  const { pushWindowPath, splitWindowPath } = useWindowPath()

  const [bookOpen, setBookOpen] = useState(false)
  const defaultLanguage = 'english'

  // Compute dialect
  const extractComputeDialect = ProviderHelpers.getEntry(computeDialect2, routeParams.dialect_path)
  const fetchDocumentAction = selectn('action', extractComputeDialect)

  const bookPath = StringHelpers.isUUID(routeParams.bookName)
    ? routeParams.bookName
    : routeParams.dialect_path + '/Stories & Songs/' + StringHelpers.clean(routeParams.bookName)

  const _computeBook = ProviderHelpers.getEntry(computeBook, bookPath)
  const _computeBookEntries = ProviderHelpers.getEntry(computeBookEntries, bookPath)
  const dialect = ProviderHelpers.getEntry(computeDialect2, routeParams.dialect_path)
  const pageCount = selectn('response.resultsCount', _computeBookEntries)
  const bookEntriesMetadata = selectn('response', _computeBookEntries) || {}
  const bookMetadata = selectn('response', _computeBook)
  const bookEntries = selectn('response.entries', _computeBookEntries) || []
  const title = selectn('properties.dc:title', bookMetadata)
  const uid = selectn('uid', bookMetadata)

  // Data for Cover
  const dominantLanguageTitleTranslation = (
    selectn('properties.fvbook:title_literal_translation', bookMetadata) || []
  ).filter(function getTranslation(translation) {
    return translation.language === defaultLanguage
  })

  const dominantLanguageIntroductionTranslation = (
    selectn('properties.fvbook:introduction_literal_translation', bookMetadata) || []
  ).filter(function getTranslation(translation) {
    return translation.language === defaultLanguage
  })

  const book = {
    uid: uid,
    type: selectn('properties.fvbook:type', bookMetadata) || '',
    title: DOMPurify.sanitize(selectn('title', bookMetadata)),
    titleTranslation: DOMPurify.sanitize(selectn('[0].translation', dominantLanguageTitleTranslation)),
    authors: (selectn('contextParameters.book.authors', bookMetadata) || []).map(function extractAuthors(author) {
      return selectn('dc:title', author)
    }),
    introduction: {
      label: intl.trans('introduction', 'Introduction', 'first'),
      content: selectn('properties.fvbook:introduction', bookMetadata) || '',
    },
    introductionTranslation: {
      label: intl.searchAndReplace(defaultLanguage),
      content: selectn('[0].translation', dominantLanguageIntroductionTranslation) || '',
    },
  }

  // Pictures
  const picturesData = selectn('contextParameters.book.related_pictures', bookMetadata) || []
  const pictures = []
  picturesData.forEach((picture, key) => {
    const pic = {
      original: selectn('views[4].url', picture) || 'assets/images/cover.png',
      thumbnail: selectn('views[0].url', picture) || 'assets/images/cover.png',
      description: picture['dc:description'],
      key: key,
      id: picture.uid,
      object: picture,
      type: 'FVPicture',
    }
    pictures.push(pic)
  })

  // Videos
  const videosData = selectn('contextParameters.book.related_videos', bookMetadata) || []
  const videos = _getMediaArray(videosData, 'FVVideo')

  // Audio
  const audioData = selectn('contextParameters.book.related_audio', bookMetadata) || []
  const audio = _getMediaArray(audioData, 'FVAudio')

  function _getMediaArray(data, type) {
    const mediaArray = []
    data.forEach((doc, key) => {
      const extractedData = {
        original: getBaseURL() + doc.path || 'assets/images/cover.png',
        thumbnail: selectn('views[0].url', doc) || 'assets/images/cover.png',
        description: doc['dc:description'],
        key: key,
        uid: doc.uid,
        object: doc,
        type: type,
      }
      mediaArray.push(extractedData)
    })
    return mediaArray
  }

  useEffect(() => {
    fetchData()
    ProviderHelpers.fetchIfMissing(routeParams.dialect_path, fetchDialect2, computeDialect2)
  }, [])

  // Set dialect state if/when fetch finishes
  useEffect(() => {
    if (title && selectn('pageTitleParams.bookName', properties) !== title) {
      changeTitleParams({ bookName: title })
      overrideBreadcrumbs({ find: uid, replace: 'pageTitleParams.bookName' })
    }
  }, [fetchDocumentAction, title])

  const fetchData = async () => {
    fetchBook(bookPath)
    fetchBookEntries(bookPath, '&sortOrder=asc,asc' + '&sortBy=fvbookentry:sort_map,dc:created')
    fetchDialect2(routeParams.dialect_path)
  }

  function openBookAction() {
    setBookOpen(true)
    window.scrollTo(0, 0)
  }

  function closeBookAction() {
    setBookOpen(false)
    window.scrollTo(0, 0)
  }

  const computeEntities = Immutable.fromJS([
    {
      id: bookPath,
      entity: _computeBook,
    },
    {
      id: bookPath,
      entity: _computeBookEntries,
    },
    {
      id: routeParams.dialect_path,
      entity: extractComputeDialect,
    },
  ])

  const isKidsTheme = routeParams.siteTheme === 'kids'

  return children({
    bookPath,
    book,
    bookEntries,
    bookOpen,
    computeBook: _computeBook,
    computeEntities,
    computeLogin,
    defaultLanguage,
    deleteBook,
    dialect,
    intl,
    isKidsTheme,
    metadata: bookEntriesMetadata,
    openBookAction,
    closeBookAction,
    pageCount,
    publishBook,
    pushWindowPath,
    routeParams,
    splitWindowPath,
    //Media
    audio,
    pictures,
    videos,
  })
}
// PROPTYPES
const { func } = PropTypes
SongStoryData.propTypes = {
  children: func,
}

export default SongStoryData
