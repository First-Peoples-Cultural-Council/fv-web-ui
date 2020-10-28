import React from 'react'
import PropTypes from 'prop-types'
import '!style-loader!css-loader!./DashboardDetail.css'

import IconWidget from '@material-ui/icons/Apps'
import Link from 'components/Link'

import useTheme from 'dataSources/useTheme'
import selectn from 'selectn'
import Typography from '@material-ui/core/Typography'
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
  // childrenUnselected,
  selectedId,
}) {
  const { theme } = useTheme()
  const workshopDark = selectn(['palette', 'primary', 'dark'], theme)
  return (
    <div className={`DashboardDetail ${selectedId ? 'DashboardDetail--Selected' : 'DashboardDetail--nothingSelected'}`}>
      {/* DashboardDetail__header
      ------------------------------------------ */}
      <div
        className="DashboardDetail__header"
        style={{
          backgroundColor: workshopDark,
        }}
      >
        <Link href="/dashboard" className="DashboardDetail__headerLink">
          <span className="DashboardDetail__iconButton">
            <IconWidget fontSize="large" />{' '}
          </span>
          <Typography variant="h5" component="span">
            Back to Dashboard
          </Typography>
        </Link>
      </div>

      {/* Full list view (no item selected)
      ------------------------------------------ */}
      {/* {selectedId === undefined && childrenUnselected} */}

      {/* Detail view (item is selected)
      ------------------------------------------ */}
      {selectedId && (
        <>
          {/* Sidebar
          ------------------------------------------ */}
          <div className="DashboardDetail__sidebar">{childrenSelectedSidebar}</div>
          {/* Selected item details/admin
          ------------------------------------------ */}
          <div className="DashboardDetail__selectedItem">{childrenSelectedDetail}</div>
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
