import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Fab from '@material-ui/core/Fab'

const styles = (theme) => {
  const { button } = theme
  const {
    contained = {},
    containedPrimary = {},
    containedSecondary = {},
    outlined = {},
    outlinedPrimary = {},
    outlinedSecondary = {},
  } = button

  return {
    contained,
    containedPrimary,
    containedSecondary,
    outlined,
    outlinedPrimary,
    outlinedSecondary,
    // NOTE: The property below increases specificity for the disabled style
    // coming from theme so it will overide the default MAT-UI disabled styling
    disabled: 'disabled',
  }
}

function FVButton(props) {
  const {
    children,
    classes, // via withStyles
    isFab = false,
    variant,
    ...allOtherProps
  } = props

  return isFab ? (
    <Fab
      variant="extended"
      classes={{
        contained: classes.contained,
        containedPrimary: classes.containedPrimary,
        containedSecondary: classes.containedSecondary,
        outlined: classes.outlined,
        outlinedPrimary: classes.outlinedPrimary,
        outlinedSecondary: classes.outlinedSecondary,
      }}
      {...allOtherProps}
    >
      {children}
    </Fab>
  ) : (
    <Button
      classes={{
        contained: classes.contained,
        containedPrimary: classes.containedPrimary,
        containedSecondary: classes.containedSecondary,
        outlined: classes.outlined,
        outlinedPrimary: classes.outlinedPrimary,
        outlinedSecondary: classes.outlinedSecondary,
      }}
      variant={variant}
      {...allOtherProps}
    >
      {children}
    </Button>
  )
}
const { object, node, string, bool } = PropTypes
FVButton.propTypes = {
  classes: object.isRequired,
  children: node,
  isFab: bool,
  variant: string,
}
FVButton.defaultProps = {
  isFab: false,
}

export default withStyles(styles)(FVButton)
