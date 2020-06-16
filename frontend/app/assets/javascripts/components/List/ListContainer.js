import React from 'react'
// import PropTypes from 'prop-types'
import ListPresentation from './ListPresentation'
import ListData from './ListData'

/**
 * @summary ListContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ListContainer() {
  return (
    <ListData>
      {(ListDataOutput) => {
        // TODO FW-1607
        // eslint-disable-next-line
        console.log('ListDataOutput', ListDataOutput)
        return <ListPresentation />
      }}
    </ListData>
  )
}
// PROPTYPES
// const { string } = PropTypes
ListContainer.propTypes = {
  //   something: string,
}

export default ListContainer
