import React from 'react'
// import PropTypes from 'prop-types'
import ListTasksPresentation from './ListTasksPresentation'
import ListTasksData from './ListTasksData'

/**
 * @summary ListTasksContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ListTasksContainer() {
  return (
    <ListTasksData>
      {(ListTasksDataOutput) => {
        // TODO FW-1607
        // eslint-disable-next-line
        console.log('ListTasksDataOutput', ListTasksDataOutput)
        return <ListTasksPresentation />
      }}
    </ListTasksData>
  )
}
// PROPTYPES
// const { string } = PropTypes
ListTasksContainer.propTypes = {
  //   something: string,
}

export default ListTasksContainer
