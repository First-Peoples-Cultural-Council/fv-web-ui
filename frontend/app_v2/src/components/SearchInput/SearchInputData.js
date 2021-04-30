import { useEffect, useRef, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import { makePlural } from 'common/urlHelpers'
import useGetSite from 'common/useGetSite'

/**
 * @summary SearchInputData
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function SearchInputData({ docType }) {
  const { title } = useGetSite()
  const { sitename } = useParams()
  const history = useHistory()
  const location = useLocation()

  // Extract search term from URL search params
  const searchTerm = new URLSearchParams(location.search).get('q') ? new URLSearchParams(location.search).get('q') : ''

  // Local State
  const [searchValue, setSearchValue] = useState(searchTerm)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentOption, setCurrentOption] = useState({ label: 'All', id: 'BOTH' })
  const type = docType ? docType : 'ALL'
  const path = docType ? makePlural(docType).toLowerCase() : 'search'
  const options = [
    { label: 'All', id: 'BOTH' },
    { label: 'English', id: 'ENGLISH' },
    { label: 'Entry', id: 'LANGUAGE' },
  ]

  const handleTextFieldChange = (event) => {
    setSearchValue(event.target.value)
  }

  const baseUrl = sitename ? `/${sitename}` : ''

  const handleSearchSubmit = () => {
    if (searchValue && searchValue !== searchTerm) {
      history.push({
        pathname: `${baseUrl}/${path}`,
        search: `?q=${searchValue}&domain=${currentOption.id}&docType=${type}`,
      })
    }
  }
  const menuRef = useRef()

  const onOptionClick = (filter) => {
    setCurrentOption(filter)
    setIsMenuOpen(false)
  }

  const onSearchOptionsClick = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleClickOutside = (event) => {
    if (menuRef?.current && menuRef.current.contains(event.target)) {
      return
    }
    // outside click
    setIsMenuOpen(false)
  }

  useEffect(() => {
    // add when mounted
    document.addEventListener('mousedown', handleClickOutside)
    // return function to be called when unmounted
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return {
    options,
    currentOption,
    handleSearchSubmit,
    handleTextFieldChange,
    isMenuOpen,
    menuRef,
    onOptionClick,
    onSearchOptionsClick,
    searchValue,
    siteTitle: title ? title : 'FirstVoices',
  }
}

// PROPTYPES
const { string } = PropTypes
SearchInputData.propTypes = {
  docType: string,
}

export default SearchInputData
