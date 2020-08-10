import React from 'react'
import PropTypes from 'prop-types'
import '!style-loader!css-loader!./DashboardDetail.css'

import IconClose from '@material-ui/icons/Cancel'
import IconWidget from '@material-ui/icons/Apps'
import IconDetail from '@material-ui/icons/VerticalSplitOutlined'
import IconList from '@material-ui/icons/ViewHeadlineOutlined'
import Link from 'views/components/Link'
/**
 * @summary DashboardDetailPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.onClose
 * @param {function} props.onOpen
 * @param {node} props.childrenSelectedDetail
 * @param {node} props.childrenSelectedSidebar
 * @param {node} props.childrenUnselected
 * @param {string} props.selectedId
 *
 * @returns {node} jsx markup
 */
function DashboardDetailPresentation({
  childrenSelectedDetail,
  childrenSelectedSidebar,
  childrenUnselected,
  onClose,
  onOpen,
  selectedId,
}) {
  return (
    <div className={`DashboardDetail ${selectedId ? 'DashboardDetail--Selected' : 'DashboardDetail--NothingSelected'}`}>
      <div className="DashboardDetail__Header">
        <Link href="/dashboard" className="DashboardDetail__HeaderLink">
          <IconWidget /> Back to Dashboard
        </Link>

        {selectedId && (
          <button className="DashboardDetail__HeaderButton" onClick={onClose}>
            <IconList /> Show full list view
          </button>
        )}
        {selectedId === undefined && (
          <button className="DashboardDetail__HeaderButton" onClick={onOpen}>
            <IconDetail /> Show detail view
          </button>
        )}
      </div>

      {selectedId === undefined && childrenUnselected}

      {selectedId && (
        <>
          <div className="DashboardDetail__List">{childrenSelectedSidebar}</div>
          <div className="DashboardDetail__SelectedItem">
            <button className="DashboardDetail__SelectedItemClose" onClick={onClose}>
              <IconClose fontSize="large" />
            </button>
            {childrenSelectedDetail}
          </div>
        </>
      )}
    </div>
  )
}
// PROPTYPES
const { func, node, string } = PropTypes
DashboardDetailPresentation.propTypes = {
  childrenSelectedDetail: node,
  childrenSelectedSidebar: node,
  childrenUnselected: node,
  onClose: func,
  onOpen: func,
  selectedId: string,
}

export default DashboardDetailPresentation
