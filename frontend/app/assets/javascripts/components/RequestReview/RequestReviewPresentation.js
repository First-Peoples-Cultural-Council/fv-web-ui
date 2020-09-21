import React from 'react'
import PropTypes from 'prop-types'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

// FPCC
import FVButton from 'views/components/FVButton'
import FVLabel from 'views/components/FVLabel'
import FVSnackbar from 'views/components/FVSnackbar'
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
        maxWidth="xs"
        open={isDialogOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogTitle>Is the {docTypeName} ready to be reviewed by the Language Administrator?</DialogTitle>
          <DialogContentText id="alert-dialog-description" className={classes.dialogDescription}>
            If you would also like to request a change to the visibility of this {docTypeName}, select below.
          </DialogContentText>
          <VisibilitySelect.Container
            docVisibility={requestVisibilityType}
            handleVisibilityChange={handleVisibilityChange}
            computeEntities={computeEntities}
            hideLabel
          />
        </DialogContent>
        <DialogActions>
          <FVButton onClick={handleDialogCancel} variant="text" color="secondary">
            <FVLabel transKey="cancel" defaultStr="Cancel" transform="first" />
          </FVButton>
          <FVButton onClick={handleDialogOk} variant="contained" color="secondary" autoFocus>
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
  handleVisibilityChange: () => {},
  isDialogOpen: false,
  snackbarOpen: false,
  handleSnackbarClose: () => {},
  requestVisibilityType: '',
  writePrivileges: false,
}

export default RequestReviewPresentation
