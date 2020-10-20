import React from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'

import Typography from '@material-ui/core/Typography'

import useTheme from 'dataSources/useTheme'
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
function DashboardPresentation({ widgets }) {
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
        {widgets.map((widget, index) => {
          return <div key={`Dashboard__widgetsContainer--${index}`}>{widget}</div>
        })}
      </div>
    </div>
  )
}

// PROPTYPES
const { array } = PropTypes
DashboardPresentation.propTypes = {
  widgets: array,
}

export default DashboardPresentation
