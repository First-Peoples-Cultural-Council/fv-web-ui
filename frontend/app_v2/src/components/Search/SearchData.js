import { useState } from 'react'
import PropTypes from 'prop-types'

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
  //DataSources

  // Local State
  const [newSearchValue, setNewSearchValue] = useState()
  const [currentFilter, setCurrentFilter] = useState("FVWord','FVPhrase','FVBook")

  // Filters
  const filters = [
    { type: "FVWord','FVPhrase','FVBook", label: 'All' },
    { type: 'FVWord', label: 'Words' },
    { type: 'FVPhrase', label: 'Phrases' },
    { type: 'FVBook', label: 'Songs/Stories' },
  ]

  const handleTextFieldChange = (event) => {
    // console.log('handleTextFieldChange FIRED')
    setNewSearchValue(event.target.value)
  }

  const handleSearchSubmit = () => {
    if (newSearchValue && newSearchValue !== '') {
      //   console.log('handleSearchSubmit FIRED')
    }
  }

  const handleFilter = (type) => {
    setCurrentFilter(type)
  }

  return children({
    currentFilter,
    dialectName: 'testDialect',
    filters,
    handleFilter,
    handleSearchSubmit,
    handleTextFieldChange,
    hasItems: true,
    isDialect: true,
    items: [
      {
        uid: '12345',
        title: 'firstword',
        href: 'url',
        translation: 'Firstword means blah blah blah',
        audio: 'audioSrc',
        picture: 'picture url',
        type: 'word',
        dialect: 'TestDialect1',
      },
      {
        uid: '65432',
        title: 'secondword',
        href: 'url',
        translation: 'secondword means blah blah blah',
        audio: 'audioSrc',
        picture: 'picture url',
        type: 'phrase',
        dialect: 'TestDialect2',
      },
    ],
    searchTerm: 'defaultSearchTerm',
    newSearchValue,
  })
}
// PROPTYPES
const { func } = PropTypes
SearchData.propTypes = {
  children: func,
}

export default SearchData
