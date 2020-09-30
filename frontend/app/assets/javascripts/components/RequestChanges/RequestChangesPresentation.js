import React from 'react'
import '!style-loader!css-loader!./RequestChanges.css'
import FVButton from 'views/components/FVButton'
import { /*getError,*/ getErrorFeedback } from 'common/FormHelpers'
import VisibilitySelect from 'components/VisibilitySelect'
import PropTypes from 'prop-types'
import FVSnackbar from '../../views/components/FVSnackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'

/**
 * @summary RequestChangesPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @param {string} props.dialectName See: VisibilitySelectPresentation
 * @param {func} props.disableApproveButton Func called to determine & set disabled state for Approve button
 * @param {func} props.disableRequestChangesButton Func called to determine & set disabled state for Request Changes button
 * @param {any} props.docVisibility See: VisibilitySelectPresentation
 * @param {any} props.errors Array of form errors, refer to FormHelpers > getErrorFeedback
 * @param {any} props.formRef React ref for form
 * @param {func} props.handleApprove Func called on approve button click
 * @param {func} props.handleRequestChanges Func called on reject button click
 * @param {func} props.handleSnackbarClose See: FVSnackbar
 * @param {func} props.handleVisibilityChange See: VisibilitySelectPresentation
 * @param {bool} props.isPublicDialect See: VisibilitySelectPresentation
 * @param {string} props.processedMessage Temporary var to hold response from server after a task has been processed. Note: the processed item disappears after refersh/pagination.
 * @param {bool} props.processedWasSuccessful Toggle related to processedMessage. When true RequestChangesPresentation only displays the message, when false the message is within the form
 * @param {string} props.requestChangesText Text for button
 * @param {string} props.selectLabelText See: VisibilitySelectPresentation
 * @param {string} props.snackbarMessage See: FVSnackbar > props.message
 * @param {bool} props.snackbarStatus See: FVSnackbar > props.open
 * @param {string} props.subTitle Text displayed in form just above VisibilitySelectPresentation
 *
 * @returns {node} jsx markup
 */
function RequestChangesPresentation({
  dialectName,
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
  processedMessage,
  processedWasSuccessful,
  requestChangesText,
  selectLabelText,
  snackbarMessage,
  snackbarStatus,
  subTitle,
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
          {processedMessage && <p>{processedMessage}</p>}

          {subTitle && (
            <Typography variant="subtitle1" component="h2" classes={{ root: 'RequestChanges__headerText' }}>
              {subTitle}
            </Typography>
          )}

          <div className="RequestChanges__container">
            <div className="RequestChanges__visibility">
              <VisibilitySelect.Presentation
                classes={{
                  root: 'VisibilitySelect--dashboardDetail',
                }}
                dialectName={dialectName}
                docVisibility={docVisibility}
                handleVisibilityChange={handleVisibilityChange}
                publicDialect={isPublicDialect}
                selectLabelText={selectLabelText}
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

const { any, string, bool, func } = PropTypes
RequestChangesPresentation.propTypes = {
  dialectName: string,
  disableApproveButton: func,
  disableRequestChangesButton: func,
  docVisibility: any,
  errors: any,
  formRef: any,
  handleApprove: func,
  handleRequestChanges: func,
  handleSnackbarClose: func,
  handleVisibilityChange: func,
  isPublicDialect: bool,
  processedMessage: string,
  processedWasSuccessful: bool,
  requestChangesText: string,
  selectLabelText: string,
  snackbarMessage: string,
  snackbarStatus: bool,
  subTitle: string,
}

RequestChangesPresentation.defaultProps = {
  disableApproveButton: true,
  disableRequestChangesButton: true,
  isPublicDialect: false,
  snackbarStatus: false,
}

export default RequestChangesPresentation
