import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import useTheme from 'DataSource/useTheme'
import selectn from 'selectn'
import '!style-loader!css-loader!./DashboardDetailSidebarItem.css'

/**
 * @summary DashboardDetailSidebarItemPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {string} props.date
 * @param {node} props.icon JSX for the icon
 * @param {boolean} props.isActive
 * @param {boolean} props.isProcessed Session level flag set after admin acts on a task
 * @param {function} props.onClick
 * @param {string} props.titleItem
 * @param {number} props.variant
 *
 * @returns {node} jsx markup
 */

import { EVEN, ODD } from 'common/Constants'

function DashboardDetailSidebarItemPresentation({ date, icon, isActive, isProcessed, onClick, titleItem, variant }) {
  const { theme } = useTheme()
  const themeTable = selectn('components.Table', theme) || {}
  const { row, rowAlternate } = themeTable

  const ItemStyle = []
  ItemStyle[EVEN] = row
  ItemStyle[ODD] = rowAlternate

  return (
    <li
      className={`DashboardDetailSidebarItem  DashboardDetailSidebarItem--li ${
        icon ? 'DashboardDetailSidebarItem--hasIcon' : ''
      } ${isActive ? 'DashboardDetailSidebarItem--isActive' : ''} ${
        onClick !== undefined ? 'DashboardDetailSidebarItem--hasOnClick' : ''
      }`}
      onClick={onClick}
      style={ItemStyle[variant]}
    >
      {icon && <div className="DashboardDetailSidebarItem__icon">{icon}</div>}
      <div className="DashboardDetailSidebarItem__main">
        {isProcessed === true && (
          <Typography variant="caption" component="div">
            Done!
          </Typography>
        )}
        <Typography variant="body1" component="h3">
          {titleItem}
        </Typography>
        <Typography variant="caption" component="div">
          {date}
        </Typography>
      </div>
    </li>
  )
}
// PROPTYPES
const { func, node, oneOf, string, bool } = PropTypes
DashboardDetailSidebarItemPresentation.propTypes = {
  date: string,
  icon: node,
  isActive: bool,
  isProcessed: bool,
  onClick: func,
  titleItem: string,
  variant: oneOf([EVEN, ODD]),
}
DashboardDetailSidebarItemPresentation.defaultProps = {
  date: '',
  titleItem: '',
}

export default DashboardDetailSidebarItemPresentation
