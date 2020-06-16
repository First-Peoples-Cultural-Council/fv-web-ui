import React from 'react'
// import PropTypes from 'prop-types'
import RecordersPresentation from './RecordersPresentation'
import RecordersData from './RecordersData'

/**
 * @summary RecordersContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function RecordersContainer() {
  return (
    <RecordersData>
      {(RecordersDataOutput) => {
        // TODO FW-1607
        // eslint-disable-next-line
        console.log('RecordersDataOutput', RecordersDataOutput)
        return <RecordersPresentation />
      }}
    </RecordersData>
  )
}
// PROPTYPES
// const { string } = PropTypes
RecordersContainer.propTypes = {
  //   something: string,
}

export default RecordersContainer
