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
 *
 * @param {array} props.listItems See: DashboardDetailSidebarPresentation
 * @param {func} props.onClick See: DashboardDetailSidebarPresentation
 * @param {string} props.selectedId See: DashboardDetailSidebarPresentation
 * @param {string} props.title Used to set text in DashboardDetailSidebarPresentation > childrenHeader
 *
 * @returns {node} jsx markup
 */
function DashboardDetailSidebarContainer({ listItems, onClick, selectedId, title }) {
  return (
    <DashboardDetailSidebarPresentation
      childrenHeader={
        <Typography variant="h5" component="h1">
          {title}
        </Typography>
      }
      childrenPagination={<TablePagination variant={TABLEPAGINATION_DIV} />}
      listItems={listItems}
      onClick={onClick}
      selectedId={selectedId}
    />
  )
}
// PROPTYPES
const { array, func, number, string } = PropTypes
DashboardDetailSidebarContainer.propTypes = {
  count: number,
  listItems: array,
  onClick: func,
  page: number,
  pageSize: number,
  selectedId: string,
  title: string,
}
DashboardDetailSidebarContainer.defaultProps = {
  listItems: [],
}

export default DashboardDetailSidebarContainer
