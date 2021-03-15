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

  // Local State
  const [newSearchValue, setNewSearchValue] = useState(query)
  const [currentFilter, setCurrentFilter] = useState('ALL')
  const { data, refetch } = useQuery(['search', query], () =>
    searchApi.get({ query, siteId: uid, type: currentFilter })
  )
  results = data?.results

  // Filters
  const filters = [
    { type: 'ALL', label: 'All' },
    { type: 'WORD', label: 'Words' },
    { type: 'PHRASE', label: 'Phrases' },
    { type: 'BOOK', label: 'Songs/Stories' },
  ]

  const handleTextFieldChange = (event) => {
    setNewSearchValue(event.target.value)
  }

  const handleSearchSubmit = () => {
    if (newSearchValue && newSearchValue !== query) {
      history.push(newSearchValue)
    }
  }

  const handleFilter = (type) => {
    setCurrentFilter(type)
    refetch()
  }

  const tools = [
    {
      toolTitle: 'copy',
      iconName: 'WebShare',
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
      },
    },
  ]

  return children({
    currentFilter,
    sitename: title,
    filters,
    handleFilter,
    handleSearchSubmit,
    handleTextFieldChange,
    hasItems: results ? true : false,
    isSite: title ? true : false,
    items: results ? results : [],
    searchTerm: query,
    newSearchValue,
    tools,
  })
}
// PROPTYPES
const { func } = PropTypes
SearchData.propTypes = {
  children: func,
}

export default SearchData
