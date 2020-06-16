import React from 'react'
// import PropTypes from 'prop-types'
import ListPhrasesFilteredByCategoryPresentation from './ListPhrasesFilteredByCategoryPresentation'
import ListPhrasesFilteredByCategoryData from './ListPhrasesFilteredByCategoryData'

/**
 * @summary ListPhrasesFilteredByCategoryContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ListPhrasesFilteredByCategoryContainer() {
  return (
    <ListPhrasesFilteredByCategoryData>
      {(ListPhrasesFilteredByCategoryDataOutput) => {
        // TODO FW-1607
        // eslint-disable-next-line
        console.log('ListPhrasesFilteredByCategoryDataOutput', ListPhrasesFilteredByCategoryDataOutput)
        return <ListPhrasesFilteredByCategoryPresentation />
      }}
    </ListPhrasesFilteredByCategoryData>
  )
}
// PROPTYPES
// const { string } = PropTypes
ListPhrasesFilteredByCategoryContainer.propTypes = {
  //   something: string,
}

export default ListPhrasesFilteredByCategoryContainer
