import React from 'react'
import PropTypes from 'prop-types'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

// FPCC
import FVButton from 'components/FVButton'
import FVLabel from 'components/FVLabel'
import FVSnackbar from 'components/FVSnackbar'
import VisibilitySelect from 'components/VisibilitySelect'
import { VisibilityMinimalStyles } from './VisibilityMinimalStyles'

/**
 * @summary VisibilityMinimalPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function VisibilityMinimalPresentation({
  computeEntities,
  dialectName,
  dialogContent,
  docVisibility,
  handleVisibilityChange,
  handleDialogCancel,
  handleDialogOk,
  isDialogOpen,
  snackbarOpen,
  handleSnackbarClose,
  writePrivileges,
}) {
  const classes = VisibilityMinimalStyles()
  function generateVisibilityLabel(visibility) {
    switch (visibility) {
      case 'team':
        return (
          <>
            {dialectName}&nbsp;
            <FVLabel transKey="team_only" defaultStr="Team Only" transform="first" />
          </>
        )
      case 'members':
        return (
          <>
            {dialectName}&nbsp;
            <FVLabel transKey="members" defaultStr="Members" transform="first" />
          </>
        )
      case 'public':
        return <FVLabel transKey="public" defaultStr="Public" transform="first" />
      default:
        return null
    }
  }

  return writePrivileges ? (
    <div className={classes.base}>
      <VisibilitySelect.Container
        docVisibility={docVisibility}
        handleVisibilityChange={handleVisibilityChange}
        computeEntities={computeEntities}
        dialectName={dialectName}
        selectLabelText={'Who can see this?'}
      />

      <Dialog
        fullWidth
        maxWidth="xs"
        open={isDialogOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description" className={classes.dialogDescription}>
            Do you want to change who can see this to
          </DialogContentText>
          <div className={classes.dialogContent}>
            <strong>{generateVisibilityLabel(dialogContent)}</strong>?
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
        message={'Your entry can be seen by the ' + dialectName + ' ' + docVisibility}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </div>
  ) : (
    <div className={classes.base}>
      <div className={classes.label}>Who can see this word?&nbsp;&nbsp;</div>
      <div className={classes.labelContents}>{generateVisibilityLabel(docVisibility)}</div>
    </div>
  )
}

// PROPTYPES
const { string, object, func, bool } = PropTypes
VisibilityMinimalPresentation.propTypes = {
  computeEntities: object,
  dialectName: string,
  dialogContent: string,
  docVisibility: string,
  handleVisibilityChange: func,
  handleDialogCancel: func,
  handleDialogOk: func,
  isDialogOpen: bool,
  snackbarOpen: bool,
  handleSnackbarClose: func,
  writePrivileges: bool,
}

VisibilityMinimalPresentation.defaultProps = {
  dialectName: '',
  dialogContent: '',
  docVisibility: '',
  handleVisibilityChange: () => {},
  handleDialogCancel: () => {},
  handleDialogOk: () => {},
  isDialogOpen: false,
  snackbarOpen: false,
  handleSnackbarClose: () => {},
  writePrivileges: false,
}

export default VisibilityMinimalPresentation
