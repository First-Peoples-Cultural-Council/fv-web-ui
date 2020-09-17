import React from 'react'
import PropTypes from 'prop-types'
import RequestChangesPresentation from 'components/RequestChanges/RequestChangesPresentation'
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
function RequestChangesContainer({
  docId,
  docState,
  docDialectPath,
  taskId,
  requestChangesText,
  processedWasSuccessful,
  processedMessage,
}) {
  return (
    <RequestChangesData docDialectPath={docDialectPath} docId={docId} docState={docState} taskId={taskId}>
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
        isPublicDialect,
        onSubmit,
        snackbarMessage,
        snackbarStatus,
        submitMethod,
      }) => {
        return (
          <RequestChangesPresentation
            computeEntities={computeEntities}
            disableApproveButton={disableApproveButton}
            disableRequestChangesButton={disableRequestChangesButton}
            docVisibility={docVisibility}
            errors={errors}
            formRef={formRef}
            handleApprove={handleApprove}
            handleRequestChanges={handleRequestChanges}
            handleSnackbarClose={handleSnackbarClose}
            handleVisibilityChange={handleVisibilityChange}
            requestChangesText={requestChangesText}
            isPublicDialect={isPublicDialect}
            onSubmit={onSubmit}
            snackbarMessage={snackbarMessage}
            snackbarStatus={snackbarStatus}
            submitMethod={submitMethod}
            processedWasSuccessful={processedWasSuccessful}
            processedMessage={processedMessage}
          />
        )
      }}
    </RequestChangesData>
  )
}

const { bool, string, oneOf } = PropTypes
RequestChangesContainer.propTypes = {
  docDialectPath: string,
  docId: string,
  docState: oneOf(['New', 'Enabled', 'Disabled', 'Published']),
  taskId: string,
  requestChangesText: string,
  processedWasSuccessful: bool,
  processedMessage: string,
}

export default RequestChangesContainer
