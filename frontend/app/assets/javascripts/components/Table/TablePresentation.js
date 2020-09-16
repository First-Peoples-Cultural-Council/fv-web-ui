import React from 'react'
import PropTypes from 'prop-types'
import MaterialTable from 'material-table'
import FVButton from 'views/components/FVButton'
import useTheme from 'DataSource/useTheme'
import selectn from 'selectn'
import { TABLE_FULL_WIDTH, WIDGET_WORKSPACE } from 'common/Constants'
import TableHeader from './TableHeader'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'

/**
 * @summary TablePresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {array} [props.actions] Array for action icons/buttons
 * @param {array} [props.columns] Array for column header
 * @param {array} [props.data] Array or Function (for remote data). Array: Data must be array of objects which has fields defined in columns. Function: Used with 'remote data'. Function should return a Promise holding data, current page & totalCount. Remote data requires handlers for searching, filtering, sorting and paging
 * @param {array|function} [props.detailPanel] Component(s) to be rendered on detail panel
 * @param {function} [props.onChangeColumnHidden] Event handler
 * @param {function} [props.onChangePage] Event handler
 * @param {function} [props.onChangeRowsPerPage] Event handler
 * @param {function} [props.onColumnDragged] Event handler
 * @param {function} [props.onGroupRemoved] Event handler
 * @param {function} [props.onOrderChange] Event handler
 * @param {function} [props.onRowClick] Event handler
 * @param {function} [props.onSearchChange] Event handler
 * @param {function} [props.onSelectionChange] Event handler
 * @param {function} [props.onTreeExpandChange] Event handler
 * @param {object} [props.options] All options of table
 * @param {object} [props.localization] Localization object of strings, see: https://material-table.com/#/docs/features/localization
 * @param {string} [props.title] Title of table
 *
 * @returns {node} jsx markup
 */
const TablePresentation = ({
  actions,
  columns,
  componentsPagination,
  data,
  detailPanel,
  localization,
  onChangeColumnHidden,
  onChangePage,
  onChangeRowsPerPage,
  onColumnDragged,
  onGroupRemoved,
  onOrderChange,
  onRowClick,
  onSearchChange,
  onSelectionChange,
  onTreeExpandChange,
  options,
  sortDirection,
  style,
  title,
  variant,
}) => {
  const { theme } = useTheme()
  const themeTable = selectn('components.Table', theme) || {}

  let styleVariant

  let headerStyle = themeTable.tableHeader
  let row = themeTable.row
  let rowAlternate = themeTable.rowAlternate

  switch (variant) {
    case TABLE_FULL_WIDTH:
      styleVariant = themeTable.fullWidth
      headerStyle = styleVariant.tableHeader
      break
    case WIDGET_WORKSPACE:
      styleVariant = selectn('widget', theme)
      row = styleVariant.row
      rowAlternate = styleVariant.rowAlternate
      headerStyle = styleVariant.tableHeader
      break

    default: {
      break
    }
  }
  const icons = {
    SortArrow: sortDirection === 'desc' ? ArrowUpwardIcon : ArrowDownwardIcon,
  }

  const defaultOptions = {
    actionsColumnIndex: 2,
    debounceInterval: 500,
    detailPanelType: 'multiple',
    draggable: false,
    emptyRowsWhenPaging: true,
    filtering: false,
    headerStyle,
    paging: false,
    rowStyle: (rowData, index) => {
      if (index % 2 === 0) {
        return row
      }
      return rowAlternate
    },
    search: false,
    selection: false,
    showTextRowsSelected: false,
    showTitle: false,
    sorting: false,
    toolbar: false,
    toolbarButtonAlignment: 'left',
  }
  const _options = Object.assign({}, defaultOptions, options)
  const componentsOverride = {
    Actions: ({ data: _data, actions: _actions }) => {
      return (
        <div className="Tasks__approveRejectContainer">
          {_actions.map(({ text, tooltip, onClick, disabled }, i) => {
            return (
              <FVButton
                key={`action${i}`}
                onClick={(event) => {
                  onClick(event, _data)
                }}
                color="secondary"
                variant="contained"
                className="Tasks__approve"
                disabled={disabled}
              >
                {text ? text : tooltip}
              </FVButton>
            )
          })}
        </div>
      )
    },
    Header: TableHeader,
  }
  if (componentsPagination) {
    componentsOverride.Pagination = componentsPagination
  }
  return (
    <MaterialTable
      key={`materialTable-${_options.pageSize}`}
      style={Object.assign({}, style, styleVariant)}
      actions={actions}
      columns={columns}
      data={data}
      onChangeColumnHidden={onChangeColumnHidden}
      onChangePage={onChangePage}
      onChangeRowsPerPage={onChangeRowsPerPage}
      onColumnDragged={onColumnDragged}
      onGroupRemoved={onGroupRemoved}
      onOrderChange={onOrderChange}
      onRowClick={onRowClick}
      onSearchChange={onSearchChange}
      onSelectionChange={onSelectionChange}
      onTreeExpandChange={onTreeExpandChange}
      options={_options}
      title={title}
      detailPanel={detailPanel}
      icons={icons}
      components={componentsOverride}
      localization={localization}
    />
  )
}
// PROPTYPES
const { array, elementType, func, string, object, oneOf, oneOfType } = PropTypes
TablePresentation.propTypes = {
  actions: array,
  columns: array,
  componentsPagination: elementType,
  data: oneOfType([array, func]),
  detailPanel: oneOfType([array, func]),
  localization: object,
  onChangeColumnHidden: func,
  onChangePage: func,
  onChangeRowsPerPage: func,
  onColumnDragged: func,
  onGroupRemoved: func,
  onOrderChange: func,
  onRowClick: func,
  onSearchChange: func,
  onSelectionChange: func,
  onTreeExpandChange: func,
  options: object,
  sortDirection: string,
  style: object,
  title: string,
  variant: oneOf([TABLE_FULL_WIDTH, WIDGET_WORKSPACE]),
}

TablePresentation.defaultProps = {
  options: {},
  style: {},
}

export default TablePresentation
