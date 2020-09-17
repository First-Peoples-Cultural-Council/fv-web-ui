import React from 'react'
import '!style-loader!css-loader!./RequestChanges.css'
import FVButton from 'views/components/FVButton'
import { /*getError,*/ getErrorFeedback } from 'common/FormHelpers'
import VisibilitySelect from 'components/VisibilitySelect'
import PropTypes from 'prop-types'
import FVSnackbar from '../../views/components/FVSnackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

/**
 * @summary RequestChangesPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function RequestChangesPresentation({
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
  requestChangesText,
  snackbarMessage,
  snackbarStatus,
  processedWasSuccessful,
  processedMessage,
}) {
  return (
    <>
      {processedWasSuccessful === true && (
        <div className="RequestChanges">
          <p>{processedMessage}</p>
        </div>
      )}

      {processedWasSuccessful !== true && (
        <form className="RequestChanges" name="requestChanges" ref={formRef}>
          {processedMessage && <p>? {processedMessage}</p>}
          <div className="RequestChanges__visibility">
            <VisibilitySelect.Presentation
              classes={{
                root: 'VisibilitySelect--dashboardDetail',
              }}
              // computeEntities={computeEntities}
              // error={getError({ errors, fieldName: 'commentField' })}
              docVisibility={docVisibility}
              handleVisibilityChange={handleVisibilityChange}
              publicDialect={isPublicDialect}
              selectNameAndId="visibilitySelect"
            />
          </div>
          {getErrorFeedback({ errors })}
          <div className="RequestChanges__actions">
            <FVButton
              disabled={disableApproveButton()}
              variant="contained"
              type="submit"
              color="primary"
              className="FVButton RequestChanges__actionButton"
              onClick={handleApprove}
              size="large"
            >
              Approve
            </FVButton>
            <FVButton
              disabled={disableRequestChangesButton()}
              variant="contained"
              type="submit"
              color="primary"
              className="FVButton RequestChanges__actionButton"
              onClick={handleRequestChanges}
              size="large"
            >
              {requestChangesText ? requestChangesText : 'Request Changes'}
            </FVButton>
          </div>
          <FVSnackbar
            open={snackbarStatus}
            autoHideDuration={3000}
            onClose={handleSnackbarClose}
            message={snackbarMessage}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            action={
              <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          />
        </form>
      )}
    </>
  )
}

const { any, string, object, bool, func } = PropTypes
RequestChangesPresentation.propTypes = {
  computeEntities: object,
  disableApproveButton: func,
  disableRequestChangesButton: func,
  handleApprove: func,
  handleRequestChanges: func,
  handleSnackbarClose: func,
  isPublicDialect: bool,
  requestChangesText: string,
  snackbarMessage: string,
  snackbarStatus: bool,
  submitMethod: string,
  docVisibility: any,
  errors: any,
  formRef: any,
  handleVisibilityChange: func,
  processedWasSuccessful: bool,
  processedMessage: string,
}

RequestChangesPresentation.defaultProps = {
  disableApproveButton: true,
  disableRequestChangesButton: true,
  isPublicDialect: false,
  snackbarStatus: false,
}

export default RequestChangesPresentation
