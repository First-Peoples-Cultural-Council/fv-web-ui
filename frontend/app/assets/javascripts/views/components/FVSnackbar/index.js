import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import FVButton from 'views/components/FVButton'
import { withStyles } from '@material-ui/core/styles'
import Fade from '@material-ui/core/Fade'
import Snackbar from '@material-ui/core/Snackbar'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'

const { string, func, object } = PropTypes

const styles = (/* theme */) => {
  return {
    root: {
      margin: 4,
      '& > * + *': {
        marginTop: 2,
        marginBottom: 2,
      },
    },
  }
}

const FVSnackbar = (props) => {
  const { buttontext, buttonhandler, classes } = props
  const [open, setOpen] = React.useState(false)
  useEffect(() => setOpen(true), [])

  const handleClose = () => {
    setOpen(false)
  }

  const action = (
    <>
      {buttontext ? (
        <FVButton variant="contained" onClick={buttonhandler}>
          {' '}
          {buttontext}
        </FVButton>
      ) : null}
      <IconButton aria-label="close" color="inherit" onClick={handleClose}>
        <CloseIcon />
      </IconButton>
    </>
  )

  return (
    <Snackbar
      className={classes.root}
      onClose={handleClose}
      onExited={handleClose}
      open={open}
      action={action}
      TransitionComponent={Fade}
      {...props}
    />
  )
}

FVSnackbar.propTypes = {
  buttontext: string,
  buttonhandler: func,
  classes: object,
}

export default withStyles(styles)(FVSnackbar)
