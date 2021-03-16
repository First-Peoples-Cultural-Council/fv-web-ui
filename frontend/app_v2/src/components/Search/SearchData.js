import { useState } from 'react'
import { useQuery } from 'react-query'
import { useParams, useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'

import useGetSite from 'common/useGetSite'
import searchApi from 'services/api/search'

/**
 * @summary SearchData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function SearchData({ children }) {
  const { title, uid } = useGetSite()
  const { query } = useParams()
  const history = useHistory()
  let results = []

  // Extract search term from query for ui display
  const separatedQuery = query.split('&')
  const searchTermForDisplay = separatedQuery[0]

  // Local State
  const [newSearchValue, setNewSearchValue] = useState(searchTermForDisplay)
  const [currentFilter, setCurrentFilter] = useState('ALL')

  // Data fetch
  const { data, isLoading, error } = useQuery(['search', query], () => searchApi.get({ query, siteId: uid }))
  results = data?.results

  // Filters
  const filters = [
    { type: 'ALL', label: 'All' },
    { type: 'WORD', label: 'Words' },
    { type: 'PHRASE', label: 'Phrases' },
    { type: 'BOOK', label: 'Songs' },
    { type: 'BOOK', label: 'Stories' },
  ]

  const handleTextFieldChange = (event) => {
    setNewSearchValue(event.target.value)
  }

  const handleSearchSubmit = () => {
    if (newSearchValue && newSearchValue !== query) {
      history.push(newSearchValue)
    }
  }

  const handleFilter = (filter) => {
    if (newSearchValue && filter && filter !== currentFilter) {
      history.push(newSearchValue + '&docType=' + filter)
    }
    setCurrentFilter(filter)
  }

  const actions = [
    {
      actionTitle: 'copy',
      iconName: 'WebShare',
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

  return children({
    currentFilter,
    sitename: title,
    error,
    filters,
    handleFilter,
    handleSearchSubmit,
    handleTextFieldChange,
    isLoading,
    isSite: title ? true : false,
    items: results ? results : [],
    searchTerm: searchTermForDisplay,
    newSearchValue,
    actions,
  })
}
// PROPTYPES
const { func } = PropTypes
SearchData.propTypes = {
  children: func,
}

export default SearchData
