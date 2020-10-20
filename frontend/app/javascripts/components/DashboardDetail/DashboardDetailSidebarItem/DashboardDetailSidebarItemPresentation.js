import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import IconProcessed from '@material-ui/icons/Check'
import useTheme from 'dataSources/useTheme'
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
  const jsxTitle = (
    <Typography variant="body1" component="h3" noWrap>
      {titleItem}
    </Typography>
  )
  const jsxInitiator = (
    <Typography variant="caption" className="DashboardDetailSidebarItem__metaInitiator" component="div" noWrap>
      Requested by {initiator}
    </Typography>
  )
  const jsxDate = (
    <Typography className="DashboardDetailSidebarItem__metaDate" variant="caption" component="div" noWrap>
      {date}
    </Typography>
  )
  return (
    <li>
      <button
        className={`DashboardDetailSidebarItem ${isActive ? 'DashboardDetailSidebarItem--isActive' : ''} ${
          isProcessed ? 'DashboardDetailSidebarItem--isProcessed' : ''
        } ${onClick ? 'DashboardDetailSidebarItem--hasOnClick' : ''}`}
        style={ItemStyle[variant]}
        onClick={onClick}
      >
        {icon && <div className="DashboardDetailSidebarItem__icon">{icon}</div>}

        <div className="DashboardDetailSidebarItem__main">
          {isProcessed !== true && (
            <>
              <div className="DashboardDetailSidebarItem__groupA">{jsxTitle}</div>
              <div className="DashboardDetailSidebarItem__groupB">
                {jsxInitiator}
                {jsxDate}
              </div>
            </>
          )}
          {isProcessed === true && (
            <>
              <div className="DashboardDetailSidebarItem__groupA">
                {jsxTitle}
                {jsxInitiator}
              </div>
              <div className="DashboardDetailSidebarItem__groupB">
                <IconProcessed style={{ alignSelf: 'center', fill: '#76ce0e' }} />
                {jsxDate}
              </div>
            </>
          )}
        </div>
      </button>
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
