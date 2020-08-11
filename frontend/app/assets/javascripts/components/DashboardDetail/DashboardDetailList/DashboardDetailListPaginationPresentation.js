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

function DashboardDetailListPaginationPresentation({
  count,
  page: pageZeroIndex,
  rowsPerPage,
  showFirstLastPageButtons,
}) {
  const { getSearchObject, navigate } = useNavigationHelpers()
  const {
    item: queryItem,
    page: queryPage = 1,
    pageSize: queryPageSize = 10,
    sortBy: querySortBy = 'date',
    sortOrder: querySortOrder = 'desc',
    task: queryTask,
  } = getSearchObject()

  const getUrlWithQuery = ({
    item = queryItem,
    page = queryPage,
    pageSize = queryPageSize,
    sortBy = querySortBy,
    sortOrder = querySortOrder,
    task = queryTask,
  }) => {
    return `${window.location.pathname}?task=${task}&item=${item}&page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`
  }

  const handleFirstPageButtonClick = () => {
    navigate(
      getUrlWithQuery({
        page: 0 + 1,
      })
    )
  }

  const handleBackButtonClick = () => {
    navigate(
      getUrlWithQuery({
        page: pageZeroIndex - 1 + 1,
      })
    )
  }

  const handleNextButtonClick = () => {
    navigate(
      getUrlWithQuery({
        page: pageZeroIndex + 1 + 1,
      })
    )
  }

  const handleLastPageButtonClick = () => {
    navigate(
      getUrlWithQuery({
        page: Math.max(0, Math.ceil(count / rowsPerPage) - 1) + 1,
      })
    )
  }

  const localization = {
    ...DashboardDetailListPaginationPresentation.defaultProps.localization,
    ...localization,
  }
  const _labelDisplayedRows = localization.labelDisplayedRows
    .replace('{from}', count === 0 ? 0 : pageZeroIndex * rowsPerPage + 1)
    .replace('{to}', Math.min((pageZeroIndex + 1) * rowsPerPage, count))
    .replace('{count}', count)

  return (
    <div>
      {showFirstLastPageButtons && (
        <Tooltip title={localization.firstTooltip}>
          <span>
            <IconButton
              onClick={handleFirstPageButtonClick}
              disabled={pageZeroIndex === 0}
              aria-label={localization.firstAriaLabel}
            >
              <IconFirstPage />
            </IconButton>
          </span>
        </Tooltip>
      )}
      <Tooltip title={localization.previousTooltip}>
        <span>
          <IconButton
            onClick={handleBackButtonClick}
            disabled={pageZeroIndex === 0}
            aria-label={localization.previousAriaLabel}
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
      <Tooltip title={localization.nextTooltip}>
        <span>
          <IconButton
            onClick={handleNextButtonClick}
            disabled={pageZeroIndex >= Math.ceil(count / rowsPerPage) - 1}
            aria-label={localization.nextAriaLabel}
          >
            <IconNextPage />
          </IconButton>
        </span>
      </Tooltip>
      {showFirstLastPageButtons && (
        <Tooltip title={localization.lastTooltip}>
          <span>
            <IconButton
              onClick={handleLastPageButtonClick}
              disabled={pageZeroIndex >= Math.ceil(count / rowsPerPage) - 1}
              aria-label={localization.lastAriaLabel}
            >
              <IconLastPage />
            </IconButton>
          </span>
        </Tooltip>
      )}
    </div>
  )
}
const { number, object, func, bool, any } = PropTypes
DashboardDetailListPaginationPresentation.propTypes = {
  count: number,
  localization: object,
  onChangePage: func,
  page: number,
  rowsPerPage: number,
  showFirstLastPageButtons: bool,
  theme: any,
}

DashboardDetailListPaginationPresentation.defaultProps = {
  showFirstLastPageButtons: true,
  localization: {
    firstTooltip: 'First Page',
    labelDisplayedRows: '{from}-{to} of {count}',
    labelRowsPerPage: 'Rows per page:',
    lastTooltip: 'Last Page',
    nextTooltip: 'Next Page',
    previousTooltip: 'Previous Page',
  },
}

export default DashboardDetailListPaginationPresentation
