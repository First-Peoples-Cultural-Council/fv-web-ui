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
function RequestChangesContainer({ docId, docState, docDialectPath }) {
  return (
    <RequestChangesData docDialectPath={docDialectPath} docId={docId} docState={docState}>
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
            isPublicDialect={isPublicDialect}
            onSubmit={onSubmit}
            snackbarMessage={snackbarMessage}
            snackbarStatus={snackbarStatus}
          />
        )
      }}
    </RequestChangesData>
  )
}

const { string } = PropTypes
RequestChangesContainer.propTypes = {
  docDialectPath: string,
  docId: string,
  docState: string,
}

export default RequestChangesContainer
