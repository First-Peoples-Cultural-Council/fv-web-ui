import React from 'react'
// import PropTypes from 'prop-types'
import ListRecordersPresentation from './ListRecordersPresentation'
import ListRecordersData from './ListRecordersData'

/**
 * @summary ListRecordersContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ListRecordersContainer() {
  return (
    <ListRecordersData>
      {(ListRecordersDataOutput) => {
        // TODO FW-1607
        // eslint-disable-next-line
        console.log('ListRecordersDataOutput', ListRecordersDataOutput)
        return <ListRecordersPresentation />
      }}
    </ListRecordersData>
  )
}
// PROPTYPES
// const { string } = PropTypes
ListRecordersContainer.propTypes = {
  //   something: string,
}

export default ListRecordersContainer
