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
      <div className="bg-white flex rounded-2xl w-3/5 text-fv-charcoal-light p-2 divide-x-2 divide-gray-300 mx-auto">
        <input
          data-testid="SearchInput"
          className="w-full focus text-2xl px-4 py-2 "
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
        <button type="button " onClick={handleSearchSubmit} className="p-2">
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
