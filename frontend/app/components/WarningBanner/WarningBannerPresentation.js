import React from 'react'
import PropTypes from 'prop-types'

// Material-UI
import Paper from '@material-ui/core/Paper'
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined'

//FPCC
import { WarningBannerStyles } from './WarningBannerStyles'

/**
 * @summary WarningBannerPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */

function WarningBannerPresentation({ message }) {
  const classes = WarningBannerStyles()

  return message ? (
    <div className={classes.root}>
      <Paper elevation={0} className={classes.customPaper}>
        <ReportProblemOutlinedIcon className={classes.icon} />
        <div>{message}</div>
      </Paper>
    </div>
  ) : null
}

// PROPTYPES
const { string } = PropTypes
WarningBannerPresentation.propTypes = {
  message: string,
}

export default WarningBannerPresentation
