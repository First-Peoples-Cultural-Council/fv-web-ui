import React from 'react'
// import PropTypes from 'prop-types'
import CategoriesListPresentation from './CategoriesListPresentation'
import CategoriesListData from './CategoriesListData'

/**
 * @summary CategoriesListContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function CategoriesListContainer() {
  return (
    <CategoriesListData>
      {(CategoriesListDataOutput) => {
        // TODO FW-1607
        // eslint-disable-next-line
        console.log('CategoriesListDataOutput', CategoriesListDataOutput)
        return <CategoriesListPresentation />
      }}
    </CategoriesListData>
  )
}
// PROPTYPES
// const { string } = PropTypes
CategoriesListContainer.propTypes = {
  //   something: string,
}

export default CategoriesListContainer
