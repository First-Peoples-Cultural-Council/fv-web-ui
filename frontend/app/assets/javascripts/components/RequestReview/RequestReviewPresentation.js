import React from 'react'
import PropTypes from 'prop-types'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
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
  computeEntities,
  dialectName,
  //   dialogContent,
  docTypeName,
  docVisibility,
  handleDialogCancel,
  handleDialogOk,
  handleRequestReview,
  handleVisibilityChange,
  isDialogOpen,
  snackbarOpen,
  handleSnackbarClose,
  //   writePrivileges,
}) {
  const classes = RequestReviewStyles()
  function generateVisibilityLabel(visibility) {
    switch (visibility) {
      case 'team':
        return (
          <>
            <span>
              This {docTypeName} can currently be seen by {dialectName}&nbsp;
            </span>
            <FVLabel transKey="team_only" defaultStr="Team Only" transform="first" />
          </>
        )
      case 'members':
        return (
          <>
            <span>
              This {docTypeName} can currently be seen by {dialectName}&nbsp;
            </span>
            <FVLabel transKey="members" defaultStr="Members" transform="first" />
          </>
        )
      case 'public':
        return (
          <>
            <span>This {docTypeName} can currently be seen by the&nbsp;</span>
            <FVLabel transKey="public" defaultStr="Public" transform="first" />
          </>
        )
      default:
        return null
    }
  }

  return (
    <>
      <FVButton className={classes.button} onClick={handleRequestReview} variant="contained" color="primary">
        <FVLabel transKey="request_review" defaultStr="Request review" transform="first" />
      </FVButton>

      <Dialog
        fullWidth
        maxWidth="xs"
        open={isDialogOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description" className={classes.dialogDescription}>
            Is the {docTypeName} ready to be reviewed by the Language Administrator?
          </DialogContentText>
          <VisibilitySelect.Container
            docVisibility={docVisibility}
            handleVisibilityChange={handleVisibilityChange}
            computeEntities={computeEntities}
          />
          <div className={classes.dialogContent}>
            <strong>{generateVisibilityLabel(docVisibility)}</strong>
          </div>
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
          'has been submitted to the Administrator for ' +
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
  dialogContent: string,
  docTypeName: string,
  docVisibility: string,
  handleDialogCancel: func,
  handleDialogOk: func,
  handleRequestReview: func,
  handleVisibilityChange: func,
  isDialogOpen: bool,
  snackbarOpen: bool,
  handleSnackbarClose: func,
  writePrivileges: bool,
}

RequestReviewPresentation.defaultProps = {
  dialectName: '',
  dialogContent: '',
  docTypeName: '',
  docVisibility: '',
  handleDialogCancel: () => {},
  handleDialogOk: () => {},
  handleRequestReview: () => {},
  handleVisibilityChange: () => {},
  isDialogOpen: false,
  snackbarOpen: false,
  handleSnackbarClose: () => {},
  writePrivileges: false,
}

export default RequestReviewPresentation
