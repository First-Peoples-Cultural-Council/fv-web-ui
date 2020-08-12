import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'
import Immutable from 'immutable'

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
  const { pushWindowPath, windowPath } = useWindowPath()

  const [isLoading, setIsLoading] = useState(false)
  const fetcherParams = { currentPageIndex: 1, pageSize: 1 }

  // Compute dialect
  const extractComputeDialect = ProviderHelpers.getEntry(computeDialect2, routeParams.dialect_path)
  const fetchDocumentAction = selectn('action', extractComputeDialect)

  const book = ProviderHelpers.getEntry(computeBook, getBookPath())
  const bookEntries = ProviderHelpers.getEntry(computeBookEntries, getBookPath())
  const dialect = ProviderHelpers.getEntry(computeDialect2, routeParams.dialect_path)

  useEffect(() => {
    setIsLoading(true)
    fetchData()
    ProviderHelpers.fetchIfMissing(routeParams.dialect_path, fetchDialect2, computeDialect2)
  }, [])

  // Set dialect state if/when fetch finishes
  useEffect(() => {
    if (fetchDocumentAction === 'FV_DIALECT2_FETCH_SUCCESS') {
      setIsLoading(false)
    }
  }, [fetchDocumentAction])

  useEffect(() => {
    fetchData()
    const extractBook = selectn('response', ProviderHelpers.getEntry(computeBook, getBookPath()))
    const title = selectn('properties.dc:title', extractBook)
    const uid = selectn('uid', extractBook)

    if (title && selectn('pageTitleParams.bookName', properties) !== title) {
      changeTitleParams({ bookName: title })
      overrideBreadcrumbs({ find: uid, replace: 'pageTitleParams.bookName' })
    }
  }, [windowPath])

  const fetchData = () => {
    fetchBook(getBookPath())
    fetchListViewData(fetcherParams)
    fetchDialect2(routeParams.dialect_path)
  }

  const fetchListViewData = () => {
    fetchBookEntries(
      getBookPath(),
      '&currentPageIndex=' +
        (fetcherParams.currentPageIndex - 1) +
        '&pageSize=' +
        fetcherParams.pageSize +
        '&sortOrder=asc,asc' +
        '&sortBy=fvbookentry:sort_map,dc:created'
    )
  }

  function getBookPath() {
    if (StringHelpers.isUUID(routeParams.bookName)) {
      return routeParams.bookName
    }
    return routeParams.dialect_path + '/Stories & Songs/' + StringHelpers.clean(routeParams.bookName)
  }

  const computeEntities = Immutable.fromJS([
    {
      id: getBookPath(),
      entity: computeBook,
    },
    {
      id: getBookPath(),
      entity: computeBookEntries,
    },
    {
      id: routeParams.dialect_path,
      entity: computeDialect2,
    },
  ])

  const isKidsTheme = routeParams.siteTheme === 'kids'

  return children({
    isLoading,
    bookPath: getBookPath(),
    book,
    bookEntries,
    computeEntities,
    dialect,
    deleteBook,
    isKidsTheme,
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
