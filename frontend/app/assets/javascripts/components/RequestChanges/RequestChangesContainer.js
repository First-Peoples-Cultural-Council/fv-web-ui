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
 * @param {string} props.requestChangesText See: RequestChangesPresentation
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
  requestChangesText,
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
            isPublicDialect={isPublicDialect}
            onSubmit={onSubmit}
            processedMessage={processedMessage}
            processedWasSuccessful={processedWasSuccessful}
            requestChangesText={requestChangesText}
            selectLabelText={selectLabelText}
            snackbarMessage={snackbarMessage}
            snackbarStatus={snackbarStatus}
            submitMethod={submitMethod}
            subTitle={subTitle}
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
  requestChangesText: string,
  selectLabelText: string,
  subTitle: string,
  taskId: string,
}

export default RequestChangesContainer
