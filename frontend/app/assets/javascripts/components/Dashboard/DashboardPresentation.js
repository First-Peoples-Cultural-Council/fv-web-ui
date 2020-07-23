import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'

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
  return (
    <>
      <Typography variant="h4" component="h1">
        Dashboard
      </Typography>
      <div className="Dashboard">
        <div>{children}</div>
        <div>{children}</div>
        {/*Remove line before release, for testing multiple columns*/}
      </div>
    </>
  )
}

// PROPTYPES
const { node } = PropTypes
DashboardPresentation.propTypes = {
  children: node,
}

export default DashboardPresentation
