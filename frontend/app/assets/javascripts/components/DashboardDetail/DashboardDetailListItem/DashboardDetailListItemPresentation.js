import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import '!style-loader!css-loader!./DashboardDetailListItem.css'
/**
 * @summary DashboardDetailListItemPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {string} props.component String to set the html tags used
 * @param {node} props.icon JSX for the icon
 * @param {string} props.title
 * @param {string} props.requestedBy
 * @param {string} props.date
 *
 * @returns {node} jsx markup
 */
function DashboardDetailListItemPresentation({ component, icon, title, requestedBy, date }) {
  const Component = component
  return (
    <Component
      className={`DashboardDetailListItem ${
        icon ? 'DashboardDetailListItem--hasIcon' : ''
      } DashboardDetailListItem--${component}`}
    >
      {icon && <div className="DashboardDetailListItem__icon">{icon}</div>}
      <div className="DashboardDetailListItem__main">
        <Typography variant="h6" component="h3">
          {title}
        </Typography>
        <div>Requested by {requestedBy}</div>
        <div>{date}</div>
      </div>
    </Component>
  )
}
// PROPTYPES
const { node, oneOf, string } = PropTypes
DashboardDetailListItemPresentation.propTypes = {
  icon: node,
  title: string,
  requestedBy: string,
  date: string,
  component: oneOf(['div', 'li']),
}
DashboardDetailListItemPresentation.defaultProps = {
  title: '',
  requestedBy: '',
  date: '',
  component: 'li',
}

export default DashboardDetailListItemPresentation
