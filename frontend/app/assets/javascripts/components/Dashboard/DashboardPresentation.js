import React from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'

import Typography from '@material-ui/core/Typography'

import useTheme from 'DataSource/useTheme'
import '!style-loader!css-loader!./Dashboard.css'

/**
 * @summary DashboardPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {node} props.children
 *
 * @returns {node} jsx markup
 */
function DashboardPresentation({ children }) {
  const { theme } = useTheme()
  const workshopDark = selectn(['palette', 'primary', 'dark'], theme)
  return (
    <div className="Dashboard">
      <div
        className="Dashboard__header"
        style={{
          backgroundColor: workshopDark,
        }}
      >
        <Typography variant="h4" component="h1" classes={{ root: 'Dashboard__headerText' }}>
          Admin Dashboard
        </Typography>
      </div>
      <div className="Dashboard__widgetsContainer">
        <div>{children}</div>
        {/*TODO: Remove line below before releasing to PROD. Added for testing multiple columns*/}
        <div>{children}</div>
      </div>
    </div>
  )
}

// PROPTYPES
const { node } = PropTypes
DashboardPresentation.propTypes = {
  children: node,
}

export default DashboardPresentation
