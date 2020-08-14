import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'
import Immutable from 'immutable'
import DOMPurify from 'dompurify'

// FPCC
import useBook from 'DataSource/useBook'
import useDialect from 'DataSource/useDialect'
import useNavigation from 'DataSource/useNavigation'
import useProperties from 'DataSource/useProperties'
import useRoute from 'DataSource/useRoute'
import useWindowPath from 'DataSource/useWindowPath'

import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'

/**
 * @summary StoryData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function StoryData({ children }) {
  const { computeBook, computeBookEntries, deleteBook, fetchBook, fetchBookEntries, publishBook } = useBook()
  const { fetchDialect2, computeDialect2 } = useDialect()
  const { changeTitleParams, overrideBreadcrumbs } = useNavigation()
  const { properties } = useProperties()
  const { routeParams } = useRoute()
  const { pushWindowPath } = useWindowPath()

  const [bookOpen, setBookOpen] = useState(false)
  const fetcherParams = { currentPageIndex: 1, pageSize: 1 }
  const DEFAULT_LANGUAGE = 'english'

  // Compute dialect
  const extractComputeDialect = ProviderHelpers.getEntry(computeDialect2, routeParams.dialect_path)
  const fetchDocumentAction = selectn('action', extractComputeDialect)

  const bookPath = StringHelpers.isUUID(routeParams.bookName)
    ? routeParams.bookName
    : routeParams.dialect_path + '/Stories & Songs/' + StringHelpers.clean(routeParams.bookName)

  const extractBook = ProviderHelpers.getEntry(computeBook, bookPath)
  const extractBookEntries = ProviderHelpers.getEntry(computeBookEntries, bookPath)
  const dialect = ProviderHelpers.getEntry(computeDialect2, routeParams.dialect_path)
  const pageCount = selectn('response.resultsCount', extractBookEntries)
  const metadata = selectn('response', extractBookEntries) || {}
  const bookRawData = selectn('response', extractBook)
  const bookEntries = selectn('response.entries', extractBookEntries) || []
  const title = selectn('properties.dc:title', book)
  const uid = selectn('uid', book)

  const dominantLanguageTitleTranslation = (
    selectn('properties.fvbook:title_literal_translation', bookRawData) || []
  ).filter(function getTranslation(translation) {
    return translation.language === DEFAULT_LANGUAGE
  })

  const book = {
    title: DOMPurify.sanitize(selectn('title', bookRawData)),
    titleTranslation: DOMPurify.sanitize(selectn('[0].translation', dominantLanguageTitleTranslation)),
    authors: (selectn('contextParameters.book.authors', bookRawData) || []).map(function extractAuthors(author) {
      return selectn('dc:title', author)
    }),
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
    fetchListViewData(fetcherParams)
    fetchDialect2(routeParams.dialect_path)
  }

  const fetchListViewData = async (params) => {
    fetchBookEntries(
      bookPath,
      '&currentPageIndex=' +
        (params.currentPageIndex - 1) +
        '&pageSize=' +
        params.pageSize +
        '&sortOrder=asc,asc' +
        '&sortBy=fvbookentry:sort_map,dc:created'
    )
  }

  function openBookAction() {
    setBookOpen(true)
  }

  function closeBookAction() {
    setBookOpen(false)
  }

  const computeEntities = Immutable.fromJS([
    {
      id: bookPath,
      entity: computeBook,
    },
    {
      id: bookPath,
      entity: computeBookEntries,
    },
    {
      id: routeParams.dialect_path,
      entity: computeDialect2,
    },
  ])

  const isKidsTheme = routeParams.siteTheme === 'kids'

  return children({
    // isLoading,
    bookPath: bookPath,
    book,
    bookEntries,
    bookOpen,
    computeEntities,
    dialect,
    deleteBook,
    isKidsTheme,
    metadata,
    openBookAction,
    closeBookAction,
    pageCount,
    publishBook,
    pushWindowPath,
  })
}
// PROPTYPES
const { func } = PropTypes
StoryData.propTypes = {
  children: func,
}

export default StoryData
