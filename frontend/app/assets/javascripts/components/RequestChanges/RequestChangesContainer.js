import React from 'react'
import PropTypes from 'prop-types'
import RequestChangesPresentation
  from 'components/RequestChanges/RequestChangesPresentation'
import RequestChangesData from 'components/RequestChanges/RequestChangesData'

/**
 * @summary RequestChangesContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function RequestChangesContainer({docId, docState}) {
  return (
      <RequestChangesData docId={docId} docState={docState}>
        {({submitMethod, computeEntities, docId, docState, docVisibility, errors, formRef, handleApprove, handleRequestChanges, handleSnackbarClose, handleVisibilityChange, onSubmit, snackbarStatus}) => {
          return <RequestChangesPresentation submitMethod={submitMethod}
                                             computeEntities={computeEntities}
                                             docId={docId}
                                             docState={docState}
                                             docVisibility={docVisibility}
                                             errors={errors}
                                             formRef={formRef}
                                             handleApprove={handleApprove}
                                             handleRequestChanges={handleRequestChanges}
                                             handleSnackbarClose={handleSnackbarClose}
                                             handleVisibilityChange={handleVisibilityChange}
                                             onSubmit={onSubmit}
                                             snackbarStatus={snackbarStatus}


          />
        }}
      </RequestChangesData>
  )
}

// PROPTYPES
const {string} = PropTypes
RequestChangesContainer.propTypes = {
  docId: string,
  docState: string,
  //   something: string,

}

export default RequestChangesContainer
