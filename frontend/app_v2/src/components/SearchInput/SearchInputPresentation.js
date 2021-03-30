import React from 'react'
import PropTypes from 'prop-types'

import useIcon from 'common/useIcon'

/**
 * @summary SearchPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function SearchInputPresentation({ handleSearchSubmit, handleTextFieldChange, searchValue, siteTitle }) {
  return (
    <>
      <div className="relative justify-center mx-auto">
        <input
          data-testid="SearchInput"
          className="w-full focus text-2xl px-4 py-2 text-fv-charcoal-light rounded-md"
          type="text"
          placeholder={`Search ${siteTitle}`}
          onChange={handleTextFieldChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearchSubmit(e)
            }
          }}
          value={searchValue}
        />
        <button
          type="button"
          onClick={handleSearchSubmit}
          className="absolute right-0 top-0 mr-2 mt-2 mb-2 pl-2 text-fv-charcoal-light border-l-2 border-gray-300"
        >
          {useIcon('Search', 'fill-current h-8 w-8 ')}
        </button>
      </div>
    </>
  )
}
// PROPTYPES
const { func, string } = PropTypes
SearchInputPresentation.propTypes = {
  handleSearchSubmit: func,
  handleTextFieldChange: func,
  searchValue: string,
  siteTitle: string,
}

export default SearchInputPresentation
