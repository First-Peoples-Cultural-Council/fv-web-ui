import { useEffect, useRef, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import { makePlural } from 'common/urlHelpers'
import useGetSite from 'common/useGetSite'

/**
 * @summary DictionarySearchInputData
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function DictionarySearchInputData({ docType }) {
  const { title } = useGetSite()
  const { sitename } = useParams()
  const history = useHistory()
  const location = useLocation()

  // Extract search term from URL search params
  const searchTerm = new URLSearchParams(location.search).get('q') ? new URLSearchParams(location.search).get('q') : ''
  const domain = new URLSearchParams(location.search).get('domain')
    ? new URLSearchParams(location.search).get('domain')
    : 'BOTH'
  const domainLabel = getLabel(domain)

  // Local State
  const [searchValue, setSearchValue] = useState(searchTerm)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentOption, setCurrentOption] = useState({ label: domainLabel, id: domain })
  const path = makePlural(docType).toLowerCase()
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

  const handleTextFieldChange = (event) => {
    setSearchValue(event.target.value)
  }

  const baseUrl = sitename ? `/${sitename}` : ''

  const handleSearchSubmit = (event) => {
    if (searchValue && searchValue !== searchTerm) {
      history.push({
        pathname: `${baseUrl}/${path}`,
        search: `?q=${searchValue}&domain=${currentOption.id}&docType=${docType}`,
      })
    }
    event.preventDefault()
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
DictionarySearchInputData.propTypes = {
  docType: string.isRequired,
}

export default DictionarySearchInputData
