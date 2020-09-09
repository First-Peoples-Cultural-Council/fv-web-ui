import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import useTheme from 'DataSource/useTheme'
import selectn from 'selectn'
import '!style-loader!css-loader!./DashboardDetailSelectedItemTask.css'

/**
 * @summary DashboardDetailSelectedItemTaskPresentation
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

import { EVEN, ODD } from 'common/Constants'

function DashboardDetailSelectedItemTaskPresentation({ date, icon, initiator, isActive, onClick, title, variant }) {
  const { theme } = useTheme()
  const themeTable = selectn('components.Table', theme) || {}
  const { row, rowAlternate } = themeTable

  const ItemStyle = []
  ItemStyle[EVEN] = row
  ItemStyle[ODD] = rowAlternate

  return (
    <div
      className={`DashboardDetailSelectedItemTask  ${icon ? 'DashboardDetailSelectedItemTask--hasIcon' : ''} ${
        isActive ? 'DashboardDetailSelectedItemTask--isActive' : ''
      } ${onClick !== undefined ? 'DashboardDetailSelectedItemTask--hasOnClick' : ''}`}
      onClick={onClick}
      style={ItemStyle[variant]}
    >
      {icon && <div className="DashboardDetailSelectedItemTask__icon">{icon}</div>}
      <div className="DashboardDetailSelectedItemTask__main">
        <Typography variant="body1" component="h3">
          {title}
        </Typography>
        <Typography variant="body2" component="div">
          {initiator}
        </Typography>
        <Typography variant="caption" component="div">
          Date added: {date}
        </Typography>
      </div>
    </div>
  )
}
// PROPTYPES
const { func, node, oneOf, string, bool } = PropTypes
DashboardDetailSelectedItemTaskPresentation.propTypes = {
  date: string,
  icon: node,
  initiator: string,
  isActive: bool,
  onClick: func,
  title: string,
  variant: oneOf([EVEN, ODD]),
}
DashboardDetailSelectedItemTaskPresentation.defaultProps = {
  date: '',
  initiator: '',
  title: '',
}

export default DashboardDetailSelectedItemTaskPresentation
