import React from 'react'
// import PropTypes from 'prop-types'
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
function SearchDialectContainer({ childrenUiSecondary, incrementResetCount }) {
  return (
    <SearchDialectData incrementResetCount={incrementResetCount}>
      {({ dialectClassName, formRefSearch, intl, onPressEnter, onSearch, searchTerm, searchStyle, onReset }) => {
        return (
          <SearchDialectPresentation
            childrenUiSecondary={childrenUiSecondary}
            dialectClassName={dialectClassName}
            formRefSearch={formRefSearch}
            intl={intl}
            onPressEnter={onPressEnter}
            onReset={onReset}
            onSearch={onSearch}
            searchTerm={searchTerm}
            searchStyle={searchStyle}
          />
        )
      }}
    </SearchDialectData>
  )
}
// PROPTYPES
// const { string } = PropTypes
SearchDialectContainer.propTypes = {
  //   something: string,
}

export default SearchDialectContainer
