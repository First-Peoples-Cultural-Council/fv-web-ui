import React from 'react'
import PropTypes from 'prop-types'

import useIcon from 'common/useIcon'

/**
 * @summary SearchInputPresentationMinimal
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function SearchInputPresentationMinimal({ handleSearchSubmit, handleTextFieldChange, searchValue }) {
  return (
    <div className="flex rounded-md ml-4 h-10 ">
      <form onSubmit={handleSearchSubmit} className="flex items-stretch flex-grow">
        <input
          data-testid="SearchInput"
          className="block w-full text-sm text-fv-charcoal-light rounded-none rounded-l-full pl-4 focus:outline-none"
          type="text"
          placeholder="Search"
          onChange={handleTextFieldChange}
          value={searchValue}
        />
      </form>

      <button
        type="button"
        onClick={handleSearchSubmit}
        className="relative inline-flex items-center px-2 py-1.5 text-fv-charcoal-light rounded-r-full bg-gray-50 hover:bg-gray-100"
      >
        {useIcon('Search', 'fill-current h-5 w-5 ')}
      </button>
    </div>
  )
}
// PROPTYPES
const { func, string } = PropTypes
SearchInputPresentationMinimal.propTypes = {
  handleSearchSubmit: func,
  handleTextFieldChange: func,
  searchValue: string,
}

export default SearchInputPresentationMinimal
