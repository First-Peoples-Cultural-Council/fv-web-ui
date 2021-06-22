import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useHistory, useLocation, useParams } from 'react-router-dom'

import useGetSite from 'common/useGetSite'
import searchApi from 'services/api/search'
import { triggerError } from 'common/navigationHelpers'
import { makePlural } from 'common/urlHelpers'

/**
 * @summary SearchData
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function SearchData() {
  const { title, uid } = useGetSite()
  const location = useLocation()
  const history = useHistory()
  const { sitename } = useParams()

  // Extract search term from URL search params
  const searchTerm = new URLSearchParams(location.search).get('q') ? new URLSearchParams(location.search).get('q') : ''
  const docType = new URLSearchParams(location.search).get('docType')
    ? new URLSearchParams(location.search).get('docType')
    : 'ALL'
  const domain = new URLSearchParams(location.search).get('domain')
    ? new URLSearchParams(location.search).get('domain')
    : 'BOTH'

  // Local State
  const [currentFilter, setCurrentFilter] = useState(docType)
  const [items, setItems] = useState([])

  // Data fetch
  const { data, error, isError, isLoading } = useQuery(
    ['search', location.search],
    () => searchApi.get(`${location.search}&ancestorId=${uid}`),
    {
      // The query will not execute until the siteId exists and a search term has been provided
      enabled: !!uid && !!searchTerm,
    }
  )

  // DataAdaptor
  const dataAdaptor = (results) => {
    const modifiedResults = results.map((result) => {
      if (!Array.isArray(result.translations)) {
        const modifiedResult = Object.assign({}, result)
        modifiedResult.translations = result.translations.translation ? [result.translations] : []
        return modifiedResult
      }
      return result
    })
    setItems(modifiedResults)
  }

  useEffect(() => {
    if (data?.results) {
      dataAdaptor(data.results)
    }
  }, [data])

  useEffect(() => {
    if (isError) triggerError(error, history)
  }, [isError])

  // Get Filters
  const filters = [{ type: 'ALL', label: 'All Results', count: data?.statistics.resultCount }]
  const countsByType = data?.statistics.countsByType ? data.statistics.countsByType : {}

  for (const [key, value] of Object.entries(countsByType)) {
    filters.push({ type: getType(key), label: makePlural(key), count: value })
  }

  function getType(countKey) {
    if (countKey === 'word' || countKey === 'phrase') {
      return countKey.toUpperCase()
    }
    if (countKey === 'song' || countKey === 'story') {
      return 'BOOK'
    }
    return 'ALL'
  }

  const handleFilter = (filter) => {
    setCurrentFilter(filter)
  }

  return {
    currentFilter,
    siteTitle: title ? title : 'FirstVoices',
    filters,
    domain,
    handleFilter,
    isLoading,
    items,
    actions: ['copy'],
    searchTerm,
    sitename,
  }
}

export default SearchData
