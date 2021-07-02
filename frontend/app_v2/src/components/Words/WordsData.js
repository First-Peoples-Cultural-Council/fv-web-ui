import { useEffect, useRef } from 'react'
import { useInfiniteQuery } from 'react-query'
import { useHistory, useLocation, useParams } from 'react-router-dom'

import useGetSite from 'common/useGetSite'
import { triggerError } from 'common/navigationHelpers'
import useIntersectionObserver from 'common/useIntersectionObserver'
import api from 'services/api'

/**
 * @summary WordsData
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function WordsData() {
  const { uid } = useGetSite()
  const location = useLocation()
  const history = useHistory()
  const { sitename } = useParams()

  const query = location.search ? location.search : '?&docType=WORD&perPage=5&sortBy=entry'

  // Param options: perPage=100&page=1&kidsOnly=false&gamesOnly=false&sortBy=entry&docType=WORDS_AND_PHRASES&sortAscending=true&q=Appla&alphabetCharacter=A
  const response = useInfiniteQuery(
    ['words', query],
    ({ pageParam = 1 }) => api.dictionary.get({ sitename: uid, query: query, pageParam: pageParam }),
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

  return {
    isLoading: isLoading || isError,
    items: data ? data : {},
    actions: ['copy'],
    moreActions: ['share'],
    sitename,
    infiniteScroll,
  }
}

export default WordsData
