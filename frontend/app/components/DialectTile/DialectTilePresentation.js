import React from 'react'
import PropTypes from 'prop-types'

// Material UI
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import LockIcon from '@material-ui/icons/Lock'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

// FPCC
import FVButton from 'components/FVButton'
import FVLabel from 'components/FVLabel'

import { DialectTileStyles } from './DialectTileStyles'
/**
 * @summary DialectTilePresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function DialectTilePresentation({
  dialectLogo,
  dialectTitle,
  actionIcon,
  isPrivate,
  href,
  onDialectClick,
  /* Props for Dialog */
  isDialogOpen,
  handleDialogCancel,
  handleDialogOk,
  joinText,
}) {
  const classes = DialectTileStyles()
  // tooltip needs to apply DOM event listeners to its child element, hence use of forwardRef
  // see https://material-ui.com/components/tooltips/#custom-child-element
  const Tile = React.forwardRef(function Tile(props, ref) {
    return (
      <a href={href} onClick={onDialectClick} title={dialectTitle} {...props} ref={ref}>
        <Card className={`${classes.card} ${isPrivate ? 'DialectPrivate' : 'Dialect'}`}>
          <CardMedia className={`${classes.cover} DialectCover`} image={dialectLogo} title={dialectTitle} />
          {isPrivate ? <LockIcon className={classes.privateIcon} /> : null}
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <span className="DialectTitle fontBCSans">
                {dialectTitle}
                {actionIcon}
              </span>
            </CardContent>
          </div>
        </Card>
      </a>
    )
  })

  return isPrivate ? (
    <>
      <Tile />

      <Dialog
        fullWidth
        maxWidth="sm"
        open={isDialogOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogTitle className={classes.dialogTitle}>{dialectTitle} is Private</DialogTitle>
          <DialogContentText id="alert-dialog-description" className={classes.dialogDescription}>
            {joinText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <FVButton onClick={handleDialogCancel} variant="text" color="secondary">
            <FVLabel transKey="Cancel" defaultStr="Cancel" />
          </FVButton>
          <FVButton onClick={handleDialogOk} variant="contained" color="primary" autoFocus>
            <FVLabel transKey="Yes" defaultStr="Yes" />
          </FVButton>
        </DialogActions>
      </Dialog>
    </>
  ) : (
    <Tile />
  )
}
// PROPTYPES
const { bool, object, string, func } = PropTypes

DialectTilePresentation.propTypes = {
  dialectLogo: string.isRequired,
  dialectTitle: string.isRequired,
  actionIcon: object,
  href: string.isRequired,
  isLoggedIn: bool.isRequired,
  isPrivate: bool.isRequired,
  onDialectClick: func.isRequired,
  isDialogOpen: bool.isRequired,
  handleDialogCancel: func.isRequired,
  handleDialogOk: func.isRequired,
  joinText: string.isRequired,
}

export default DialectTilePresentation
