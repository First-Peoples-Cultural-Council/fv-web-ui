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
        workspaces,
        dialectName,
        dialogContent,
        docTypeName,
        docVisibility,
        handleDialogCancel,
        handleDialogOk,
        handleRequestReview,
        handleSnackbarClose,
        handleVisibilityChange,
        snackbarOpen,
        isDialogOpen,
        writePrivileges,
      }) => {
        return workspaces ? (
          <div>
            <RequestReviewPresentation
              computeEntities={computeEntities}
              dialectName={dialectName}
              dialogContent={dialogContent}
              docTypeName={docTypeName}
              docVisibility={docVisibility}
              handleDialogCancel={handleDialogCancel}
              handleDialogOk={handleDialogOk}
              handleRequestReview={handleRequestReview}
              handleSnackbarClose={handleSnackbarClose}
              handleVisibilityChange={handleVisibilityChange}
              snackbarOpen={snackbarOpen}
              isDialogOpen={isDialogOpen}
              writePrivileges={writePrivileges}
            />
          </div>
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
