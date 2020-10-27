import React from 'react'
import PropTypes from 'prop-types'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

// FPCC
import FVButton from 'components/FVButton'
import FVLabel from 'components/FVLabel'
import FVSnackbar from 'components/FVSnackbar'
import VisibilitySelect from 'components/VisibilitySelect'
import { RequestReviewStyles } from './RequestReviewStyles'

/**
 * @summary RequestReviewPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function RequestReviewPresentation({
  dialectName,
  docTypeName,
  handleRequestReview,
  hasRelatedTasks,
  /* Props for Dialog */
  isDialogOpen,
  handleDialogCancel,
  handleDialogOk,
  handleTextFieldChange,
  requestVisibilityType,
  /* Props for Snackbar */
  handleSnackbarClose,
  snackbarOpen,
  /* Props for VisibilitySelect */
  handleVisibilityChange,
  computeEntities,
}) {
  const classes = RequestReviewStyles()
  const buttonLabel = hasRelatedTasks ? (
    <FVLabel transKey="review_requested" defaultStr="Review requested" transform="first" />
  ) : (
    <FVLabel transKey="request_review" defaultStr="Request review" transform="first" />
  )
  return (
    <>
      <FVButton
        className={classes.button}
        onClick={handleRequestReview}
        variant="contained"
        color="primary"
        disabled={hasRelatedTasks}
      >
        {buttonLabel}
      </FVButton>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={isDialogOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogTitle className={classes.dialogTitle}>
            Is the {docTypeName} ready for review by your Language Administrator?
          </DialogTitle>
          <DialogContentText id="alert-dialog-description" className={classes.dialogDescription}>
            To request a change to the visibility of this {docTypeName} select below{' '}
            <span className={classes.helperText}>(Optional)</span>
          </DialogContentText>
          <VisibilitySelect.Container
            docVisibility={requestVisibilityType}
            handleVisibilityChange={handleVisibilityChange}
            computeEntities={computeEntities}
            hideLabel
            dialectName={dialectName}
          />
          <TextField
            id="comment"
            label="Add comment"
            className={classes.dialogTextField}
            multiline
            rowsMax={4}
            fullWidth
            variant="outlined"
            onChange={handleTextFieldChange}
          />
        </DialogContent>
        <DialogActions>
          <FVButton onClick={handleDialogCancel} variant="text" color="secondary">
            <FVLabel transKey="cancel" defaultStr="Cancel" transform="first" />
          </FVButton>
          <FVButton onClick={handleDialogOk} variant="contained" color="primary" autoFocus>
            <FVLabel transKey="yes" defaultStr="Yes" transform="first" />
          </FVButton>
        </DialogActions>
      </Dialog>

      <FVSnackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={
          'Your request for review of this ' +
          docTypeName +
          ' has been submitted to the Administrator for ' +
          dialectName
        }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  )
}

// PROPTYPES
const { string, object, func, bool } = PropTypes
RequestReviewPresentation.propTypes = {
  computeEntities: object,
  dialectName: string,
  docTypeName: string,
  handleDialogCancel: func,
  handleDialogOk: func,
  handleRequestReview: func,
  handleTextFieldChange: func,
  handleVisibilityChange: func,
  hasRelatedTasks: bool,
  isDialogOpen: bool,
  snackbarOpen: bool,
  handleSnackbarClose: func,
  requestVisibilityType: string,
  writePrivileges: bool,
}

RequestReviewPresentation.defaultProps = {
  dialectName: '',
  docTypeName: '',
  handleDialogCancel: () => {},
  handleDialogOk: () => {},
  handleRequestReview: () => {},
  handleTextFieldChange: () => {},
  handleVisibilityChange: () => {},
  isDialogOpen: false,
  snackbarOpen: false,
  handleSnackbarClose: () => {},
  requestVisibilityType: '',
  writePrivileges: false,
}

export default RequestReviewPresentation
