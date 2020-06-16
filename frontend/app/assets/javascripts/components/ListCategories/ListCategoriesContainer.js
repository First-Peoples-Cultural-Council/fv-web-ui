import React from 'react'
// import PropTypes from 'prop-types'
import ListCategoriesPresentation from './ListCategoriesPresentation'
import ListCategoriesData from './ListCategoriesData'

/**
 * @summary ListCategoriesContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ListCategoriesContainer() {
  return (
    <ListCategoriesData>
      {(ListCategoriesDataOutput) => {
        // TODO FW-1607
        // eslint-disable-next-line
        console.log('ListCategoriesDataOutput', ListCategoriesDataOutput)
        return <ListCategoriesPresentation />
      }}
    </ListCategoriesData>
  )
}
// PROPTYPES
// const { string } = PropTypes
ListCategoriesContainer.propTypes = {
  //   something: string,
}

export default ListCategoriesContainer
