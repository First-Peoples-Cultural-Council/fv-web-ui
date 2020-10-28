import React from 'react'
import PropTypes from 'prop-types'

// FPCC
import RequestReviewPresentation from 'components/RequestReview/RequestReviewPresentation'
import RequestReviewData from 'components/RequestReview/RequestReviewData'

/**
 * @summary RequestReviewContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {string} docId UID of the document that is being viewed
 * @param {string} docState The nuxeo 'state' of the document: 'New', 'Enabled', 'Disabled', or 'Published'.
 * @param {object} computeEntities Immutable.fromJS object for the PromiseWrapper component which is rendered by the VisibilitySelectContainer
 *
 * @returns {node} jsx markup
 */
function RequestReviewContainer({ docId, docState, docType, computeEntities }) {
  return (
    <RequestReviewData docId={docId} docState={docState} docType={docType}>
      {({
        dialectName,
        docTypeName,
        handleDialogCancel,
        handleDialogOk,
        handleRequestReview,
        handleSnackbarClose,
        handleTextFieldChange,
        handleVisibilityChange,
        hasRelatedTasks,
        hideButton,
        snackbarOpen,
        isDialogOpen,
        requestVisibilityType,
        writePrivileges,
        workspaces,
      }) => {
        return workspaces && !hideButton ? (
          <RequestReviewPresentation
            computeEntities={computeEntities}
            dialectName={dialectName}
            docTypeName={docTypeName}
            handleDialogCancel={handleDialogCancel}
            handleDialogOk={handleDialogOk}
            handleRequestReview={handleRequestReview}
            handleSnackbarClose={handleSnackbarClose}
            handleTextFieldChange={handleTextFieldChange}
            handleVisibilityChange={handleVisibilityChange}
            hasRelatedTasks={hasRelatedTasks}
            isDialogOpen={isDialogOpen}
            requestVisibilityType={requestVisibilityType}
            snackbarOpen={snackbarOpen}
            writePrivileges={writePrivileges}
          />
        ) : null
      }}
    </RequestReviewData>
  )
}
// PROPTYPES
const { string, object } = PropTypes
RequestReviewContainer.propTypes = {
  docId: string,
  docState: string,
  docType: string,
  computeEntities: object,
}

RequestReviewContainer.defaultProps = {
  docId: '',
  docState: '',
  docType: '',
}

export default RequestReviewContainer
