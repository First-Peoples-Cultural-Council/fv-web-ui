import React from 'react'
import PropTypes from 'prop-types'
import '!style-loader!css-loader!./DashboardDetail.css'

import ListAltIcon from '@material-ui/icons/ListAlt'
import ClearIcon from '@material-ui/icons/Clear'

/**
 * @summary DashboardDetailPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {node} props.children
 * @param {node} props.childrenSelectedItem
 *
 * @returns {node} jsx markup
 */
function DashboardDetailPresentation({ children, childrenSelectedItem }) {
  return (
    <div
      className={`DashboardDetail ${
        childrenSelectedItem ? 'DashboardDetail--Selected' : 'DashboardDetail--NothingSelected'
      }`}
    >
      <div className="DashboardDetail__Header">
        {childrenSelectedItem && (
          <button className="DashboardDetail__ViewToggle">
            <ListAltIcon /> Show full list view
          </button>
        )}
        {!childrenSelectedItem && (
          <button className="DashboardDetail__ViewToggle">
            <ListAltIcon /> Show detail view
          </button>
        )}
      </div>
      <div className="DashboardDetail__List">{children}</div>
      {childrenSelectedItem && (
        <div className="DashboardDetail__SelectedItem">
          <button className="DashboardDetail__SelectedItemClose">
            <ClearIcon />
          </button>
          {childrenSelectedItem}
        </div>
      )}
    </div>
  )
}
// PROPTYPES
const { node } = PropTypes
DashboardDetailPresentation.propTypes = {
  children: node,
  childrenSelectedItem: node,
}

export default DashboardDetailPresentation
