import * as React from 'react'
import PropTypes from 'prop-types'
import useNavigationHelpers from 'common/useNavigationHelpers'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import IconFirstPage from '@material-ui/icons/FirstPage'
import IconLastPage from '@material-ui/icons/LastPage'
import IconPreviousPage from '@material-ui/icons/ChevronLeft'
import IconNextPage from '@material-ui/icons/ChevronRight'
import TableCell from '@material-ui/core/TableCell'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

import { TABLEPAGINATION_DIV } from 'common/Constants'
import { TableContextCount } from 'components/Table/TableContext'

function TablePagination({ localization, rowsPerPageOptions, showFirstLastPageButtons, style, variant }) {
  const { getSearchObject, navigate } = useNavigationHelpers()
  const {
    item: queryItem,
    page: queryPage = 1,
    pageSize: queryPageSize = 10,
    sortBy: querySortBy = 'date',
    sortOrder: querySortOrder = 'desc',
    task: queryTask,
  } = getSearchObject()
  const queryPageNum = Number(queryPage)
  const queryPageSizeNum = Number(queryPageSize)
  const getUrlWithQuery = ({
    item = queryItem,
    page = queryPage,
    pageSize = queryPageSize,
    sortBy = querySortBy,
    sortOrder = querySortOrder,
    task = queryTask,
  }) => {
    return `${window.location.pathname}?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}${
      task ? `&task=${task}` : ''
    }${item ? `&item=${item}` : ''}`
  }
  const handleChangePerPage = (event) => {
    navigate(
      getUrlWithQuery({
        pageSize: event.target.value,
        page: 1,
      })
    )
  }
  const handleFirstPageButtonClick = () => {
    navigate(
      getUrlWithQuery({
        page: 1,
      })
    )
  }

  const handleBackButtonClick = () => {
    navigate(
      getUrlWithQuery({
        page: queryPageNum - 1,
      })
    )
  }

  const handleNextButtonClick = () => {
    navigate(
      getUrlWithQuery({
        page: queryPageNum + 1,
      })
    )
  }

  const labelId = 'labelId'
  const selectId = 'selectId'
  const Component = variant === TABLEPAGINATION_DIV ? 'div' : TableCell
  return (
    <TableContextCount.Consumer>
      {(count) => {
        const handleLastPageButtonClick = () => {
          navigate(
            getUrlWithQuery({
              page: Math.max(0, Math.ceil(count / queryPageSizeNum) - 1) + 1,
            })
          )
        }

        const _localization = {
          ...TablePagination.defaultProps.localization,
          ...localization,
        }
        const _labelDisplayedRows = _localization.labelDisplayedRows
          .replace('{from}', count === 0 ? 0 : (queryPageNum - 1) * queryPageSizeNum + 1)
          .replace('{to}', Math.min(queryPageNum * queryPageSizeNum, count))
          .replace('{count}', count)
        return (
          <Component
            className={`TablePagination ${
              variant === TABLEPAGINATION_DIV ? 'TablePagination--div' : 'TablePagination--td'
            }`}
          >
            <div style={style}>
              {rowsPerPageOptions.length > 1 && (
                <Typography color="inherit" variant="body2" id={labelId}>
                  {_localization.labelRowsPerPage}
                </Typography>
              )}
              {rowsPerPageOptions.length > 1 && (
                <Select value={queryPageSizeNum} onChange={handleChangePerPage} id={selectId} labelId={labelId}>
                  {rowsPerPageOptions.map((rowsPerPageOption) => (
                    <MenuItem
                      key={rowsPerPageOption.value ? rowsPerPageOption.value : rowsPerPageOption}
                      value={rowsPerPageOption.value ? rowsPerPageOption.value : rowsPerPageOption}
                    >
                      {rowsPerPageOption.label ? rowsPerPageOption.label : rowsPerPageOption}
                    </MenuItem>
                  ))}
                </Select>
              )}

              {/* Pagination */}
              {showFirstLastPageButtons && (
                <Tooltip title={_localization.firstTooltip}>
                  <span>
                    <IconButton
                      onClick={handleFirstPageButtonClick}
                      disabled={queryPageNum === 1}
                      aria-label={_localization.firstAriaLabel}
                    >
                      <IconFirstPage />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
              <Tooltip title={_localization.previousTooltip}>
                <span>
                  <IconButton
                    onClick={handleBackButtonClick}
                    disabled={queryPageNum === 1}
                    aria-label={_localization.previousAriaLabel}
                  >
                    <IconPreviousPage />
                  </IconButton>
                </span>
              </Tooltip>
              <Typography
                variant="caption"
                style={{
                  flex: 1,
                  textAlign: 'center',
                  alignSelf: 'center',
                  flexBasis: 'inherit',
                }}
              >
                {_labelDisplayedRows}
              </Typography>
              <Tooltip title={_localization.nextTooltip}>
                <span>
                  <IconButton
                    onClick={handleNextButtonClick}
                    disabled={queryPageNum - 1 >= Math.ceil(count / queryPageSizeNum) - 1}
                    aria-label={_localization.nextAriaLabel}
                  >
                    <IconNextPage />
                  </IconButton>
                </span>
              </Tooltip>
              {showFirstLastPageButtons && (
                <Tooltip title={_localization.lastTooltip}>
                  <span>
                    <IconButton
                      onClick={handleLastPageButtonClick}
                      disabled={queryPageNum - 1 >= Math.ceil(count / queryPageSizeNum) - 1}
                      aria-label={_localization.lastAriaLabel}
                    >
                      <IconLastPage />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
            </div>
          </Component>
        )
      }}
    </TableContextCount.Consumer>
  )
}
const { array, number, object, oneOf, bool } = PropTypes
TablePagination.propTypes = {
  localization: object,
  page: number,
  rowsPerPageOptions: array,
  showFirstLastPageButtons: bool,
  style: object,
  variant: oneOf([TABLEPAGINATION_DIV]),
}

TablePagination.defaultProps = {
  showFirstLastPageButtons: true,
  rowsPerPageOptions: [5, 10, 20],
  localization: {
    firstTooltip: 'First Page',
    labelDisplayedRows: '{from}-{to} of {count}',
    labelRowsPerPage: 'Rows per page:',
    lastTooltip: 'Last Page',
    nextTooltip: 'Next Page',
    previousTooltip: 'Previous Page',
  },
}

export default TablePagination
