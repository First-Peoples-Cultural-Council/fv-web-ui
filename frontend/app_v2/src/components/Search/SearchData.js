import { useState } from 'react'
import { useQuery } from 'react-query'
import { useHistory, useLocation } from 'react-router-dom'

import useGetSite from 'common/useGetSite'
import searchApi from 'services/api/search'

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
  const history = useHistory()
  const location = useLocation()

  // Extract search term from URL search params
  const searchTerm = new URLSearchParams(location.search).get('q') ? new URLSearchParams(location.search).get('q') : ''
  const docTypeFilter = new URLSearchParams(location.search).get('docType')
    ? new URLSearchParams(location.search).get('docType')
    : 'ALL'

  // Local State
  const [currentFilter, setCurrentFilter] = useState(docTypeFilter)

  // Data fetch
  const response = useQuery(['search', location.search], () => searchApi.get(`${location.search}&ancestorId=${uid}`), {
    // The query will not execute until the siteId exists
    enabled: !!uid,
  })
  const { data, isLoading, error } = response

  // DataAdaptor
  const items = data?.results
    ? data?.results.map((result) => {
        if (!Array.isArray(result.translations)) {
          const modifiedResult = Object.assign({}, result)
          modifiedResult.translations = result.translations.translation ? [result.translations] : []
          return modifiedResult
        }
        return result
      })
    : []

  // Get Filters
  const filters =
    currentFilter !== 'ALL'
      ? [{ type: 'ALL', label: 'Back to ALL', count: null }]
      : [{ type: 'ALL', label: 'ALL', count: data?.statistics.resultCount }]
  const countsByType = data?.statistics.countsByType ? data.statistics.countsByType : {}

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
    if (searchTerm && filter && filter !== currentFilter) {
      history.push({ pathname: 'search', search: `?q=${searchTerm}&docType=${filter}` })
    }
    setCurrentFilter(filter)
  }

  const actions = [
    {
      actionTitle: 'copy',
      iconName: 'Copy',
      confirmationMessage: 'Copied!',
      clickHandler: function clickCopyHandler(str) {
        // Create new element
        const el = document.createElement('textarea')
        // Set value (string to be copied)
        el.value = str
        // Set non-editable to avoid focus and move outside of view
        el.setAttribute('readonly', '')
        el.style = { position: 'absolute', left: '-9999px' }
        document.body.appendChild(el)
        // Select text inside element
        el.select()
        // Copy text to clipboard
        document.execCommand('copy')
        // Remove temporary element
        document.body.removeChild(el)
        //Set tooltip confirmation with timeout
        document.getElementById(`copy-message-${str}`).style.display = 'contents'
        setTimeout(function timeout() {
          document.getElementById(`copy-message-${str}`).style.display = 'none'
        }, 1000)
      },
    },
  ]

  return {
    currentFilter,
    siteTitle: title ? title : 'FirstVoices',
    error,
    filters,
    handleFilter,
    isLoading,
    items,
    actions,
  }
}

export default SearchData
