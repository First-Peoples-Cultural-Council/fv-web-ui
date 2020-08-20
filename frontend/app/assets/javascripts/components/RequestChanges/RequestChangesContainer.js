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
 * @param {string} docId UID of the document that is being reviewed
 * @param {string} docState The nuxeo 'state' of the document: 'New', 'Enabled', 'Disabled', or 'Published'
 *
 * @returns {node} jsx markup
 */
function RequestChangesContainer({docId, docState}) {
  return (
      <RequestChangesData docId={docId} docState={docState}>
        {({
          computeEntities,
          disableApproveButton,
          disableRequestChangesButton,
          docVisibility,
          errors,
          formRef,
          handleApprove,
          handleRequestChanges,
          handleSnackbarClose,
          handleVisibilityChange,
          onSubmit,
          snackbarMessage,
          snackbarStatus,
          submitMethod
        }) => {
          return <RequestChangesPresentation computeEntities={computeEntities}
                                             disableApproveButton={disableApproveButton}
                                             disableRequestChangesButton={disableRequestChangesButton}
                                             docVisibility={docVisibility}
                                             errors={errors}
                                             formRef={formRef}
                                             handleApprove={handleApprove}
                                             handleRequestChanges={handleRequestChanges}
                                             handleSnackbarClose={handleSnackbarClose}
                                             handleVisibilityChange={handleVisibilityChange}
                                             onSubmit={onSubmit}
                                             snackbarMessage={snackbarMessage}
                                             snackbarStatus={snackbarStatus}
                                             submitMethod={submitMethod}
          />
        }}
      </RequestChangesData>
  )
}

const {string} = PropTypes
RequestChangesContainer.propTypes = {
  docId: string,
  docState: string,
}

export default RequestChangesContainer
