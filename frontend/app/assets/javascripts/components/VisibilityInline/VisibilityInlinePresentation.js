import React from 'react'
import PropTypes from 'prop-types'

import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'

// FPCC
import FVButton from 'views/components/FVButton'
import FVLabel from 'views/components/FVLabel'
import VisibilitySelect from 'components/VisibilitySelect'
import { VisibilityInlineStyles } from './VisibilityInlineStyles'

/**
 * @summary VisibilityInlinePresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function VisibilityInlinePresentation({
  computeEntities,
  dialectName,
  docVisibility,
  handleVisibilityChange,
  handleDialogCancel,
  handleDialogOk,
  isDialogOpen,
  writePrivileges,
}) {
  const classes = VisibilityInlineStyles()
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
      />

      <Dialog
        fullWidth
        maxWidth="xs"
        open={isDialogOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to change who can see this?
            <br />
            <strong>{generateVisibilityLabel(docVisibility)}</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <FVButton onClick={handleDialogCancel} variant="text" color="secondary">
            <FVLabel transKey="cancel" defaultStr="Cancel" transform="first" />
          </FVButton>
          <FVButton onClick={handleDialogOk} variant="contained" color="secondary" autoFocus>
            <FVLabel transKey="ok" defaultStr="Ok" transform="first" />
          </FVButton>
        </DialogActions>
      </Dialog>
    </div>
  ) : (
    <div className={classes.base}>
      <div className={classes.label}>Who can see this word?</div>
      <Typography variant="body2">{generateVisibilityLabel(docVisibility)}</Typography>
    </div>
  )
}

// PROPTYPES
const { string, object, func, bool } = PropTypes
VisibilityInlinePresentation.propTypes = {
  computeEntities: object,
  dialectName: string,
  docVisibility: string,
  handleVisibilityChange: func,
  handleDialogCancel: func,
  handleDialogOk: func,
  isDialogOpen: bool,
  writePrivileges: bool,
}

VisibilityInlinePresentation.defaultProps = {
  dialectName: '',
  docVisibility: '',
  handleVisibilityChange: () => {},
  handleDialogCancel: () => {},
  handleDialogOk: () => {},
  isDialogOpen: false,
  writePrivileges: false,
}

export default VisibilityInlinePresentation
