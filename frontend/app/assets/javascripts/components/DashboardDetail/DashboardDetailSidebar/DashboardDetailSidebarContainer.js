import React from 'react'
import PropTypes from 'prop-types'
import DashboardDetailSidebarPresentation from 'components/DashboardDetail/DashboardDetailSidebar/DashboardDetailSidebarPresentation'
import TablePagination from 'components/Table/TablePagination'

import Typography from '@material-ui/core/Typography'
import { TABLEPAGINATION_DIV } from 'common/Constants'

/**
 * @summary DashboardDetailSidebarContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {array} props.listItems
 * @param {function} props.onClick
 * @param {string} props.selectedId
 * @param {string} props.title
 *
 * @returns {node} jsx markup
 */
function DashboardDetailSidebarContainer({ listItems, onClick, selectedId, title, page, pageSize, count }) {
  return (
    <DashboardDetailSidebarPresentation
      childrenHeader={
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
      }
      childrenPagination={
        <TablePagination variant={TABLEPAGINATION_DIV} count={count} page={page - 1} rowsPerPage={pageSize} />
      }
      listItems={listItems}
      onClick={onClick}
      selectedId={selectedId}
    />
  )
}
// PROPTYPES
const { array, func, number, string } = PropTypes
DashboardDetailSidebarContainer.propTypes = {
  listItems: array,
  onClick: func,
  selectedId: string,
  title: string,
  page: number,
  pageSize: number,
  count: number,
}
DashboardDetailSidebarContainer.defaultProps = {
  listItems: [],
}

export default DashboardDetailSidebarContainer
