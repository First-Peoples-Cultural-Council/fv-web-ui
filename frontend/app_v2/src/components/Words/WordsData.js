import { useEffect, useRef, useState } from 'react'
import { useInfiniteQuery } from 'react-query'
import { useHistory, useLocation, useParams } from 'react-router-dom'

import useGetSite from 'common/useGetSite'
import { triggerError } from 'common/navigationHelpers'
import useIntersectionObserver from 'common/useIntersectionObserver'
import dictionaryApi from 'services/api/dictionary'

/**
 * @summary WordsData
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function WordsData() {
  const { title, uid } = useGetSite()
  const location = useLocation()
  const history = useHistory()
  const { sitename } = useParams()

  const searchTerm = new URLSearchParams(location.search).get('q') ? new URLSearchParams(location.search).get('q') : ''
  const query = location.search ? location.search : '?&docType=WORD&perPage=5&sortBy=entry'

  const [currentFilter, setCurrentFilter] = useState('WORD')

  // Param options: perPage=100&page=1&kidsOnly=false&gamesOnly=false&sortBy=entry&docType=WORDS_AND_PHRASES&sortAscending=true&q=Appla&alphabetCharacter=A
  const response = useInfiniteQuery(
    ['words', query],
    ({ pageParam = 1 }) => dictionaryApi.get({ sitename: uid, query: query, pageParam: pageParam }),
    {
      // The query will not execute until the siteId exists and a search term has been provided
      enabled: !!uid,
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  )

  const { data, error, fetchNextPage, hasNextPage, isError, isFetchingNextPage, isLoading } = response

  useEffect(() => {
    if (isError) triggerError(error, history)
  }, [isError])

  const loadButtonRef = useRef()
  let loadButtonLabel = ''
  if (isFetchingNextPage) {
    loadButtonLabel = 'Loading more...'
  } else if (hasNextPage) {
    loadButtonLabel = 'Load more'
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
    isLoading: isLoading || isError,
    items: data ? data : {},
    actions: ['copy'],
    moreActions: ['share'],
    searchTerm,
    sitename,
    infiniteScroll,
  }
}

export default WordsData
