import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'
import Immutable from 'immutable'

// FPCC
import useBook from 'dataSources/useBook'
import useDialect from 'dataSources/useDialect'
import useIntl from 'dataSources/useIntl'
import useLogin from 'dataSources/useLogin'
import useNavigation from 'dataSources/useNavigation'
import useProperties from 'dataSources/useProperties'
import useRoute from 'dataSources/useRoute'
import useWindowPath from 'dataSources/useWindowPath'

import NavigationHelpers from 'common/NavigationHelpers'
import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'
import { getBookData, getBookAudioVideo, getBookPictures } from 'components/SongStory/SongStoryUtility'

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

  const book = getBookData({ computeBookData: bookMetadata, intl })

  const baseUrl = NavigationHelpers.getBaseURL()

  // Pictures
  const picturesData = selectn('contextParameters.book.related_pictures', bookMetadata) || []
  const pictures = getBookPictures({ data: picturesData })

  // Videos
  const videosData = selectn('contextParameters.book.related_videos', bookMetadata) || []
  const videos = getBookAudioVideo({ data: videosData, type: 'FVVideo', baseUrl })

  // Audio
  const audioData = selectn('contextParameters.book.related_audio', bookMetadata) || []
  const audio = getBookAudioVideo({ data: audioData, type: 'FVAudio', baseUrl })

  useEffect(() => {
    fetchData()
    ProviderHelpers.fetchIfMissing({ key: routeParams.dialect_path, action: fetchDialect2, reducer: computeDialect2 })
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
