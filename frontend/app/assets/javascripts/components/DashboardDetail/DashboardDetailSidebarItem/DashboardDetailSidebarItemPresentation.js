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
 *
 * @param {string} props.date String for task creation date
 * @param {node} props.icon JSX for the icon
 * @param {string} props.initiator String for user that initiated the request
 * @param {boolean} props.isActive Toggles css class for selected item
 * @param {boolean} props.isProcessed Toggles styling for finished task (NOTE: is a temporary state)
 * @param {function} props.onClick <li> click handler
 * @param {string} props.titleItem Title of the associated item (word, phrase, etc)
 * @param {number} props.variant Toggles zebra striping styling [using 0 or 1]
 *
 * @returns {node} jsx markup
 */

import { EVEN, ODD } from 'common/Constants'

function DashboardDetailSidebarItemPresentation({
  date,
  icon,
  initiator,
  isActive,
  isProcessed,
  onClick,
  titleItem,
  variant,
}) {
  const { theme } = useTheme()
  const themeTable = selectn('components.Table', theme) || {}
  const { row, rowAlternate } = themeTable

  const ItemStyle = []
  ItemStyle[EVEN] = row
  ItemStyle[ODD] = rowAlternate

  return (
    <li
      className={`DashboardDetailSidebarItem ${icon ? 'DashboardDetailSidebarItem--hasIcon' : ''} ${
        isActive ? 'DashboardDetailSidebarItem--isActive' : ''
      } ${onClick !== undefined ? 'DashboardDetailSidebarItem--hasOnClick' : ''}`}
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
        <Typography variant="body1" component="h3" noWrap>
          {titleItem}
        </Typography>
        <div
          className={`DashboardDetailSidebarItem__meta ${
            initiator ? 'DashboardDetailSidebarItem__meta--hasInitiator' : ''
          }`}
        >
          {initiator && (
            <Typography variant="caption" className="DashboardDetailSidebarItem__metaInitiator" component="div" noWrap>
              {initiator}
            </Typography>
          )}
          <Typography className="DashboardDetailSidebarItem__metaDate" variant="caption" component="div" noWrap>
            {date}
          </Typography>
        </div>
      </div>
    </li>
  )
}
// PROPTYPES
const { func, node, oneOf, string, bool } = PropTypes
DashboardDetailSidebarItemPresentation.propTypes = {
  date: string,
  icon: node,
  initiator: string,
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
