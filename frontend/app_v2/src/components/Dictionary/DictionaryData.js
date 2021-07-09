import { useEffect, useRef, useState } from 'react'
import { useInfiniteQuery } from 'react-query'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import useGetSite from 'common/useGetSite'
import { triggerError } from 'common/navigationHelpers'
import { makePlural } from 'common/urlHelpers'
import useIntersectionObserver from 'common/useIntersectionObserver'
import api from 'services/api'

/**
 * @summary DictionaryData
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function DictionaryData({ docType }) {
  const { title, uid } = useGetSite()
  const { sitename } = useParams()
  const location = useLocation()
  const history = useHistory()

  const query = location.search ? location.search : `?&docType=${docType}&perPage=100`

  // Param options: perPage=100&page=1&kidsOnly=false&gamesOnly=false&sortBy=entry&docType=WORDS_AND_PHRASES&sortAscending=true&q=Appla&alphabetCharacter=A
  const { data, error, fetchNextPage, hasNextPage, isError, isFetchingNextPage, isLoading } = useInfiniteQuery(
    [docType, query],
    ({ pageParam = 1 }) => api.dictionary.get({ sitename: uid, query: query, pageParam: pageParam }),
    {
      // The query will not execute until the siteId exists and a search term has been provided
      enabled: !!uid,
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  )

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
    loadButtonLabel = 'End of list.'
  }

  useIntersectionObserver({
    target: loadButtonRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  })

  // Props needed for infinite scroll
  const infiniteScroll = { fetchNextPage, hasNextPage, isFetchingNextPage, loadButtonLabel, loadButtonRef }

  const searchTerm = new URLSearchParams(location.search).get('q') ? new URLSearchParams(location.search).get('q') : ''
  const domain = new URLSearchParams(location.search).get('domain')
    ? new URLSearchParams(location.search).get('domain')
    : 'BOTH'

  // Local State
  const [searchValue, setSearchValue] = useState(searchTerm)
  const [currentOption, setCurrentOption] = useState({ label: getLabel(domain), id: domain })
  const [sorting, setSorting] = useState({ sortBy: '', sortAscending: false })
  const typePlural = makePlural(docType).toLowerCase()
  const baseUrl = sitename ? `/${sitename}` : ''

  const handleTextFieldChange = (event) => {
    setSearchValue(event.target.value)
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    const _query = searchValue ? `q=${searchValue}&` : ''
    history.push({
      pathname: `${baseUrl}/${typePlural}`,
      search: `?${_query}&domain=${currentOption.id}&docType=${docType}`,
    })
  }

  const resetSearch = (event) => {
    event.preventDefault()
    setCurrentOption({ label: 'All', id: 'BOTH' })
    setSearchValue('')
    history.push({
      pathname: `${baseUrl}/${typePlural}`,
      search: `?domain=BOTH&docType=${docType}`,
    })
  }
  /*
  Search side dropdown menu
  */
  const options = [
    { label: 'All', id: 'BOTH' },
    { label: 'English', id: 'ENGLISH' },
    { label: 'Entry', id: 'LANGUAGE' },
  ]

  function getLabel(option) {
    switch (option) {
      case 'ENGLISH':
        return 'English'
      case 'LANGUAGE':
        return 'Entry'
      default:
        return 'All'
    }
  }

  const onOptionClick = (filter) => {
    setCurrentOption(filter)
    if (searchValue) {
      history.push({
        pathname: `${baseUrl}/${typePlural}`,
        search: `?q=${searchValue}&domain=${filter.id}&docType=${docType}`,
      })
    }
  }

  /*
  Table sorting
  */
  const onSortByClick = (field) => {
    let sortingString = ''
    if (sorting?.sortBy === field) {
      if (sorting?.sortAscending) {
        sortingString = `&sortBy=${field}&sortAscending=false`
        setSorting({ sortBy: field, sortAscending: false })
      } else {
        setSorting({ sortBy: '', sortAscending: false })
      }
    } else if (sorting?.sortBy !== field) {
      sortingString = `&sortBy=${field}&sortAscending=true`
      setSorting({ sortBy: field, sortAscending: true })
    }
    const _query = searchValue ? `q=${searchValue}&` : ''
    history.push({
      pathname: `${baseUrl}/${typePlural}`,
      search: `?${_query}domain=${currentOption.id}&docType=${docType}${sortingString}`,
    })
  }

  return {
    isLoading: title ? false : true,
    isLoadingEntries: isLoading || isError,
    items: data ? data : {},
    actions: ['copy'],
    moreActions: ['share'],
    sitename,
    infiniteScroll,
    currentOption,
    handleSearchSubmit,
    handleTextFieldChange,
    onOptionClick,
    onSortByClick,
    options,
    resetSearch,
    searchValue,
    siteTitle: title,
    sorting,
    typePlural,
  }
}

// PROPTYPES
const { string } = PropTypes
DictionaryData.propTypes = {
  docType: string.isRequired,
}

export default DictionaryData
