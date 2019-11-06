import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const styles = (theme) => {
  const { button } = theme
  const { contained = {}, containedPrimary = {}, containedSecondary = {} } = button
  return {
    contained,
    containedPrimary,
    containedSecondary,
    // NOTE: The property below increases specificity for the disabled style
    // coming from theme so it will overide the default MAT-UI disabled styling
    disabled: 'disabled',
  }
}

function FVButton(props) {
  const { children, classes } = props

  return (
    <Button
      classes={{
        contained: classes.contained,
        containedPrimary: classes.containedPrimary,
        containedSecondary: classes.containedSecondary,
      }}
      {...props}
    >
      {children}
    </Button>
  )
}

FVButton.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node,
}

export default withStyles(styles)(FVButton)
