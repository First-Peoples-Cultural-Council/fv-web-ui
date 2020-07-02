import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'

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
      {children}
    </>
  )
}
// PROPTYPES
const { node } = PropTypes
DashboardPresentation.propTypes = {
  children: node,
}

export default DashboardPresentation
