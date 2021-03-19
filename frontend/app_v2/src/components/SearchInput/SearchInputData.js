import { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import useGetSite from 'common/useGetSite'

/**
 * @summary SearchInputData
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function SearchInputData() {
  const { title } = useGetSite()
  const history = useHistory()
  const location = useLocation()

  // Extract search term from URL search params
  const searchTerm = new URLSearchParams(location.search).get('q') ? new URLSearchParams(location.search).get('q') : ''

  // Local State
  const [searchValue, setSearchValue] = useState(searchTerm)

  const handleTextFieldChange = (event) => {
    setSearchValue(event.target.value)
  }

  const baseUrl = title ? `/${title}` : ''

  const handleSearchSubmit = () => {
    if (searchValue && searchValue !== searchTerm) {
      history.push({ pathname: `${baseUrl}/search`, search: '?q=' + searchValue })
    }
  }

  return {
    sitename: title ? title : 'FirstVoices',
    handleSearchSubmit,
    handleTextFieldChange,
    searchTerm,
    searchValue,
  }
}

export default SearchInputData
