import { useEffect, useRef, useState } from 'react'
import { useInfiniteQuery } from 'react-query'
import { useHistory, useLocation } from 'react-router-dom'

import useGetSite from 'common/useGetSite'
import { triggerError } from 'common/navigationHelpers'
import useIntersectionObserver from 'common/useIntersectionObserver'
import testApi from 'services/api/test'

/**
 * @summary WordsData
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function WordsData() {
  const { title, path } = useGetSite()
  const location = useLocation()
  const history = useHistory()
  const siteShortUrl = path ? path.split('/').pop() : ''

  // Extract search term from URL search params
  const searchTerm = new URLSearchParams(location.search).get('q') ? new URLSearchParams(location.search).get('q') : ''
  const docTypeFilter = new URLSearchParams(location.search).get('docType')
    ? new URLSearchParams(location.search).get('docType')
    : 'ALL'

  // Local State
  const [currentFilter, setCurrentFilter] = useState(docTypeFilter)

  // Data fetch
  //   const response = useQuery(['search', location.search], () => searchApi.get(`${location.search}&ancestorId=${uid}`), {
  //     // The query will not execute until the siteId exists and a search term has been provided
  //     enabled: !!uid && !!searchTerm,
  //   })
  //   const response = useQuery(['search', location.search], () => testApi.get())
  //   const { data, error, isError, isLoading } = response

  const response = useInfiniteQuery('words', ({ pageParam = 1 }) => testApi.get(pageParam), {
    getNextPageParam: () => 2,
  })

  const { data, error, fetchNextPage, hasNextPage, isError, isFetchingNextPage, isLoading } = response

  useEffect(() => {
    if (isError) triggerError(error, history)
  }, [isError])

  const loadButtonRef = useRef()
  let loadButtonLabel = ''
  if (isFetchingNextPage) {
    loadButtonLabel = 'Loading more...'
  } else if (hasNextPage) {
    loadButtonLabel = 'Load More'
  } else {
    loadButtonLabel = 'Nothing more to load'
  }

  useIntersectionObserver({
    target: loadButtonRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  })

  // Props needed for infinite scroll
  const infiniteScroll = { fetchNextPage, hasNextPage, isFetchingNextPage, loadButtonLabel, loadButtonRef }

  // Get Filters
  const filters = [{ type: 'ALL', label: 'All Results', count: data?.pages?.[0].statistics.resultCount }]
  const countsByType = data?.pages?.[0].statistics.countsByType ? data.pages[0].statistics.countsByType : {}

  for (const [key, value] of Object.entries(countsByType)) {
    filters.push({ type: getType(key), label: key, count: value })
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
    handleFilter,
    isLoading,
    items: data ? data : {},
    actions: ['copy'],
    moreActions: ['share'],
    searchTerm,
    siteShortUrl,
    infiniteScroll,
  }
}

export default WordsData
