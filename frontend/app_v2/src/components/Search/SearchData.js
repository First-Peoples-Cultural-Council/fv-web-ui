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

  const siteId = uid ? `&siteId=${uid}` : ''

  // Data fetch
  const response = useQuery(['search', location.search], () => searchApi.get(location.search + siteId))
  const { data, isLoading, error } = response
  const results = data?.results ? data?.results : []

  // Filters
  const filters = [
    { type: 'ALL', label: 'ALL' },
    { type: 'WORD', label: 'WORDS' },
    { type: 'PHRASE', label: 'PHRASES' },
    { type: 'BOOK', label: 'SONGS' },
    { type: 'BOOK', label: 'STORIES' },
  ]

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
    sitename: title ? title : 'FirstVoices',
    error,
    filters,
    handleFilter,
    isLoading,
    items: results,
    searchTerm,
    actions,
  }
}

export default SearchData
