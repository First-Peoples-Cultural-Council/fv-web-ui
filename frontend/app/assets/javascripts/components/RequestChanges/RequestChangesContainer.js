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
 *
 * @param {string} props.docDialectPath See: RequestChangesData
 * @param {string} props.docId See: RequestChangesData
 * @param {string} props.docState See: RequestChangesData
 * @param {string} props.processedMessage See: RequestChangesPresentation
 * @param {boolean} props.processedWasSuccessful See: RequestChangesPresentation
 * @param {string} props.selectLabelText See: RequestChangesPresentation > VisibilitySelectPresentation
 * @param {string} props.subTitle See: RequestChangesPresentation
 * @param {string} props.taskId See: RequestChangesData
 *
 * @returns {node} jsx markup
 */
function RequestChangesContainer({
  docDialectPath,
  docId,
  docState,
  processedMessage,
  processedWasSuccessful,
  requestedVisibility,
  selectLabelText,
  subTitle,
  taskId,
}) {
  return (
    <RequestChangesData docDialectPath={docDialectPath} docId={docId} docState={docState} taskId={taskId}>
      {({
        computeEntities,
        disableApproveButton,
        disableRequestChangesButton,
        docVisibility,
        errors,
        formRefDrawer,
        formRefModal,
        handleApprove,
        handleIgnore,
        handleRequestChanges,
        handleSnackbarClose,
        handleVisibilityChange,
        isDialogOpen,
        isPublicDialect,
        onSubmit,
        snackbarMessage,
        snackbarStatus,
        submitMethod,
        toggleModal,
      }) => {
        return (
          <RequestChangesPresentation
            computeEntities={computeEntities}
            disableApproveButton={disableApproveButton}
            disableRequestChangesButton={disableRequestChangesButton}
            docVisibility={requestedVisibility ? requestedVisibility : docVisibility}
            errors={errors}
            formRefDrawer={formRefDrawer}
            formRefModal={formRefModal}
            handleApprove={handleApprove}
            handleIgnore={handleIgnore}
            handleRequestChanges={handleRequestChanges}
            handleSnackbarClose={handleSnackbarClose}
            handleVisibilityChange={handleVisibilityChange}
            isDialogOpen={isDialogOpen}
            isPublicDialect={isPublicDialect}
            onSubmit={onSubmit}
            processedMessage={processedMessage}
            processedWasSuccessful={processedWasSuccessful}
            selectLabelText={selectLabelText}
            snackbarMessage={snackbarMessage}
            snackbarStatus={snackbarStatus}
            submitMethod={submitMethod}
            subTitle={subTitle}
            toggleModal={toggleModal}
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
  processedMessage: string,
  processedWasSuccessful: bool,
  requestedVisibility: oneOf(['New', 'Enabled', 'Disabled', 'Published']),
  selectLabelText: string,
  subTitle: string,
  taskId: string,
}

export default RequestChangesContainer
