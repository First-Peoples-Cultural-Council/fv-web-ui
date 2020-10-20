import React from 'react'
import '!style-loader!css-loader!./RequestChanges.css'
import FVButton from 'views/components/FVButton'
import { /*getError,*/ getErrorFeedback } from 'common/FormHelpers'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import FVLabel from 'views/components/FVLabel'
import TextField from '@material-ui/core/TextField'

import VisibilitySelect from 'components/VisibilitySelect'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'

/**
 * @summary RequestChangesPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @param {string} props.dialectName See: VisibilitySelectPresentation
 * @param {func} props.disableApproveButton Func called to determine & set disabled state for 'Approve' button
 * @param {func} props.disableDeclineButton Func called to determine & set disabled state for 'Decline' button
 * @param {func} props.disableRequestChangesButton Func called to determine & set disabled state for 'Request Changes' button
 * @param {any} props.docVisibility See: VisibilitySelectPresentation
 * @param {any} props.errors Array of form errors, refer to FormHelpers > getErrorFeedback
 * @param {any} props.formRefDrawer React ref for form in the drawer (visibility)
 * @param {any} props.formRefModal React ref for form in modal (request changes / comment)
 * @param {func} props.handleApprove Func called on 'approve' button click
 * @param {func} props.handleIgnore Func called on 'decline' button click
 * @param {func} props.handleRequestChanges Func called on 'request changes' button click
 * @param {func} props.handleVisibilityChange See: VisibilitySelectPresentation
 * @param {bool} props.isDialogOpen Bool that toggles a dialog
 * @param {bool} props.isPublicDialect See: VisibilitySelectPresentation
 * @param {string} props.processedMessage Temporary var to hold response from server after a task has been processed. Note: the processed item disappears after refersh/pagination.
 * @param {bool} props.processedWasSuccessful Toggle related to processedMessage. When true RequestChangesPresentation only displays the message, when false the message is within the form
 * @param {string} props.selectLabelText See: VisibilitySelectPresentation
 * @param {string} props.subTitle Text displayed in form just above VisibilitySelectPresentation
 * @param {func} props.toggleModal Func that'll toggle the modal (ie: isDialogOpen)
 *
 * @returns {node} jsx markup
 */
function RequestChangesPresentation({
  dialectName,
  disableApproveButton,
  disableDeclineButton,
  disableRequestChangesButton,
  docVisibility,
  errors,
  formRefDrawer,
  formRefModal,
  handleApprove,
  handleIgnore,
  handleRequestChanges,
  handleVisibilityChange,
  isDialogOpen,
  isPublicDialect,
  processedMessage,
  processedWasSuccessful,
  selectLabelText,
  subTitle,
  toggleModal,
}) {
  const classes = {}
  return (
    <>
      {processedWasSuccessful === true && (
        <div className="RequestChanges">
          <p>{processedMessage}</p>
        </div>
      )}

      {processedWasSuccessful !== true && (
        <form className="RequestChanges" name="requestChanges" ref={formRefDrawer}>
          {processedMessage && <p>{processedMessage}</p>}

          {subTitle && (
            <Typography variant="h6" component="h2" classes={{ root: 'RequestChanges__headerText' }}>
              {subTitle}
            </Typography>
          )}

          <div className="RequestChanges__container">
            <div className="RequestChanges__visibility">
              <VisibilitySelect.Presentation
                classes={{
                  root: 'VisibilitySelect--dashboardDetail',
                  formControl: 'RequestChanges__visibilitySelect',
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
                className="FVButton RequestChanges__actionButton RequestChanges__actionButton--approve"
                onClick={handleApprove}
                size="large"
              >
                Approve
              </FVButton>
              <FVButton
                disabled={disableDeclineButton()}
                variant="contained"
                type="button"
                color="primary"
                className="FVButton RequestChanges__actionButton"
                onClick={handleIgnore}
                size="large"
              >
                Ignore
              </FVButton>
              <FVButton
                disabled={disableRequestChangesButton()}
                variant="contained"
                type="button"
                color="primary"
                className="FVButton RequestChanges__actionButton"
                onClick={toggleModal}
                size="large"
              >
                Request Changes
              </FVButton>
            </div>
          </div>
          <Dialog
            fullWidth
            maxWidth="sm"
            open={isDialogOpen}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <DialogTitle className={classes.dialogTitle}>Request Changes</DialogTitle>
              <DialogContentText id="alert-dialog-description" className={classes.dialogDescription}>
                Please provide some feedback to the member on what needs to be changed
              </DialogContentText>
              <form ref={formRefModal}>
                <TextField
                  id="comment"
                  name="comment"
                  label="Add comment"
                  // className={classes.dialogTextField}
                  multiline
                  rowsMax={4}
                  fullWidth
                  variant="outlined"
                />
              </form>
            </DialogContent>
            <DialogActions>
              <FVButton onClick={toggleModal} variant="text" color="secondary">
                <FVLabel transKey="cancel" defaultStr="Cancel" transform="first" />
              </FVButton>
              <FVButton onClick={handleRequestChanges} variant="contained" color="primary" autoFocus>
                <FVLabel transKey="submit" defaultStr="Submit" transform="first" />
              </FVButton>
            </DialogActions>
          </Dialog>
        </form>
      )}
    </>
  )
}

const { any, string, bool, func, object } = PropTypes
RequestChangesPresentation.propTypes = {
  dialectName: string,
  disableApproveButton: func,
  disableDeclineButton: func,
  disableRequestChangesButton: func,
  docVisibility: any,
  errors: any,
  formRef: any,
  formRefDrawer: object,
  formRefModal: object,
  handleApprove: func,
  handleIgnore: func,
  handleRequestChanges: func,
  handleVisibilityChange: func,
  isDialogOpen: bool,
  isPublicDialect: bool,
  processedMessage: string,
  processedWasSuccessful: bool,
  selectLabelText: string,
  snackbarStatus: bool,
  subTitle: string,
  toggleModal: func,
}

RequestChangesPresentation.defaultProps = {
  disableApproveButton: () => {},
  disableDeclineButton: () => {
    return false
  },
  disableRequestChangesButton: () => {},
  handleApprove: () => {},
  handleIgnore: () => {},
  handleRequestChanges: () => {},
  isPublicDialect: false,
  toggleModal: () => {},
}

export default RequestChangesPresentation
