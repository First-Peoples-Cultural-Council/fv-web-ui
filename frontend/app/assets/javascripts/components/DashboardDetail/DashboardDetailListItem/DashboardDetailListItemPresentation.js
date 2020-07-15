import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import useTheme from 'DataSource/useTheme'
import selectn from 'selectn'
import '!style-loader!css-loader!./DashboardDetailListItem.css'

/**
 * @summary DashboardDetailListItemPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {string} props.component String to set the html tags used
 * @param {string} props.date
 * @param {node} props.icon JSX for the icon
 * @param {string} props.initiator
 * @param {boolean} props.isActive
 * @param {function} props.onClick
 * @param {string} props.title
 * @param {number} props.variant
 *
 * @returns {node} jsx markup
 */

const EVEN = 0
const ODD = 1

function DashboardDetailListItemPresentation({ component, date, icon, initiator, isActive, onClick, title, variant }) {
  const { theme } = useTheme()
  const themeTable = selectn('components.Table', theme) || {}
  const { row, rowAlternate } = themeTable

  const ItemStyle = []
  ItemStyle[EVEN] = row
  ItemStyle[ODD] = rowAlternate

  const Tag = component
  return (
    <Tag
      className={`DashboardDetailListItem  DashboardDetailListItem--${component} ${
        icon ? 'DashboardDetailListItem--hasIcon' : ''
      } ${isActive ? 'DashboardDetailListItem--isActive' : ''}`}
      onClick={onClick}
      style={ItemStyle[variant]}
    >
      {icon && <div className="DashboardDetailListItem__icon">{icon}</div>}
      <div className="DashboardDetailListItem__main">
        <Typography variant="body1" component="h3">
          {title}
        </Typography>
        <Typography variant="body2" component="div">
          Requested by {initiator}
        </Typography>
        <Typography variant="caption" component="div">
          {date}
        </Typography>
      </div>
    </Tag>
  )
}
// PROPTYPES
const { func, node, oneOf, string, bool } = PropTypes
DashboardDetailListItemPresentation.propTypes = {
  component: oneOf(['div', 'li']),
  date: string,
  icon: node,
  initiator: string,
  isActive: bool,
  onClick: func,
  title: string,
  variant: oneOf([EVEN, ODD]),
}
DashboardDetailListItemPresentation.defaultProps = {
  component: 'li',
  date: '',
  initiator: '',
  onClick: () => {},
  title: '',
}

export default DashboardDetailListItemPresentation
