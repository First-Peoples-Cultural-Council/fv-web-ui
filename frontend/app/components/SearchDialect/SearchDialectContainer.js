import React from 'react'
import PropTypes from 'prop-types'
import SearchDialectPresentation from 'components/SearchDialect/SearchDialectPresentation'
import SearchDialectData from 'components/SearchDialect/SearchDialectData'

/**
 * @summary SearchDialectContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function SearchDialectContainer({
  browseMode,
  childrenSearchMessage,
  childrenUiSecondary,
  incrementResetCount,
  searchDialectDataType,
}) {
  return (
    <SearchDialectData incrementResetCount={incrementResetCount}>
      {({ dialectClassName, formRefSearch, intl, onPressEnter, onReset, onSearch, searchStyle, searchTerm }) => {
        return (
          <SearchDialectPresentation
            browseMode={browseMode}
            childrenSearchMessage={childrenSearchMessage}
            childrenUiSecondary={childrenUiSecondary}
            dialectClassName={dialectClassName}
            formRefSearch={formRefSearch}
            intl={intl}
            onPressEnter={onPressEnter}
            onReset={onReset}
            onSearch={onSearch}
            searchDialectDataType={searchDialectDataType}
            searchStyle={searchStyle}
            searchTerm={searchTerm}
          />
        )
      }}
    </SearchDialectData>
  )
}
// PROPTYPES
const { func, node, string, number } = PropTypes
SearchDialectContainer.propTypes = {
  browseMode: string,
  childrenSearchMessage: node,
  childrenUiSecondary: node,
  incrementResetCount: func,
  searchDialectDataType: number,
}

export default SearchDialectContainer
