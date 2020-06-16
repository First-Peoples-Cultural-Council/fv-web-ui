import React from 'react'
// import PropTypes from 'prop-types'
import ListPhraseBooksPresentation from './ListPhraseBooksPresentation'
import ListPhraseBooksData from './ListPhraseBooksData'

/**
 * @summary ListPhraseBooksContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ListPhraseBooksContainer() {
  return (
    <ListPhraseBooksData>
      {(ListPhraseBooksDataOutput) => {
        // TODO FW-1607
        // eslint-disable-next-line
        console.log('ListPhraseBooksDataOutput', ListPhraseBooksDataOutput)
        return <ListPhraseBooksPresentation />
      }}
    </ListPhraseBooksData>
  )
}
// PROPTYPES
// const { string } = PropTypes
ListPhraseBooksContainer.propTypes = {
  //   something: string,
}

export default ListPhraseBooksContainer
