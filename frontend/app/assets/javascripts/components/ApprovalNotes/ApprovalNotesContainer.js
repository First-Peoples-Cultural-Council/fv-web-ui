import React from 'react'
// import PropTypes from 'prop-types'
import ApprovalNotesPresentation from 'components/ApprovalNotes/ApprovalNotesPresentation'
import ApprovalNotesData from 'components/ApprovalNotes/ApprovalNotesData'

/**
 * @summary ApprovalNotesContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ApprovalNotesContainer() {
  return (
    <ApprovalNotesData>
      {(ApprovalNotesDataOutput) => {
        // TODO FW-ApprovalNotes
        // eslint-disable-next-line
        console.log('ApprovalNotesDataOutput', ApprovalNotesDataOutput)
        return <ApprovalNotesPresentation />
      }}
    </ApprovalNotesData>
  )
}
// PROPTYPES
// const { string } = PropTypes
ApprovalNotesContainer.propTypes = {
  //   something: string,
}

export default ApprovalNotesContainer
