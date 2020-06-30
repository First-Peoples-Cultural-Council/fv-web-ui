// NOTE: This ListData file is just an example
// NOTE: We are using the `List/ListPresentation` file in other List* components
import PropTypes from 'prop-types'
import useTheme from 'DataSource/useTheme'
import selectn from 'selectn'

/**
 * @summary ListData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {array | function} [props.data = [{col1Data: 'Col 1 data', col2Data: 'Col 2 data'}] ] Array or Function (for remote data). Array: Data must be array of objects which has fields defined in columns. Function: Used with 'remote data'. Function should return a Promise holding data, current page & totalCount. Remote data requires handlers for searching, filtering, sorting and paging
 * @param {array | function} [props.detailPanel] Component(s) to be rendered on detail panel
 * @param {array} [props.actions = undefined] Array for action icons/buttons
 * @param {array} [props.columns = [{ title: 'Col 1', field: 'col1Data' }, { title: 'Col 2', field: 'col2Data' }]] Array for column header
 * @param {boolean} [props.emptyRowsWhenPaging = true] Adds extra rows to pagination
 * @param {boolean} [props.isDraggable = false] Enables column dragging
 * @param {boolean} [props.showFiltering = false] Show filtering
 * @param {boolean} [props.showPaging = false] Show paging
 * @param {boolean} [props.showSearch = false] Show search in Toolbar
 * @param {boolean} [props.showSelection = false] Enable batch select
 * @param {boolean} [props.showSorting = false] Enable sorting
 * @param {boolean} [props.showTextRowsSelected = false] Show text saying how many rows have been selected
 * @param {boolean} [props.showTitle = false] Show table title
 * @param {boolean} [props.showToolbar = false] Show toolbar area (above table header)
 * @param {function} [props.onChangeColumnHidden = ()=>{}] Event handler
 * @param {function} [props.onChangePage = ()=>{}] Event handler
 * @param {function} [props.onChangeRowsPerPage = ()=>{}] Event handler
 * @param {function} [props.onColumnDragged = ()=>{}] Event handler
 * @param {function} [props.onGroupRemoved = ()=>{}] Event handler
 * @param {function} [props.onOrderChange = ()=>{}] Event handler
 * @param {function} [props.onRowClick = undefined] Event handler
 * @param {function} [props.onSearchChange = ()=>{}] Event handler
 * @param {function} [props.onSelectionChange = ()=>{}] Event handler
 * @param {function} [props.onTreeExpandChange = ()=>{}] Event handler
 * @param {function} props.children Render prop technique
 * @param {number} [props.actionsColumnIndex = 3] Index for the Actions column
 * @param {string} [props.title = 'Table'] Title of table
 * @param {string} [props.toolbarButtonAlignment = 'left'] Either 'left' or 'right'
 *
 */
function ListData({
  actions,
  actionsColumnIndex,
  children,
  columns,
  data,
  detailPanel,
  emptyRowsWhenPaging,
  isDraggable,
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
  showFiltering,
  showPaging,
  showSearch,
  showSelection,
  showSorting,
  showTextRowsSelected,
  showTitle,
  showToolbar,
  title,
  toolbarButtonAlignment,
}) {
  const { theme } = useTheme()
  const { tableHeader, row, rowAlternate } = selectn('components.List', theme) || {}
  const options = {
    actionsColumnIndex,
    debounceInterval: 500,
    detailPanelType: 'multiple',
    draggable: isDraggable,
    emptyRowsWhenPaging,
    filtering: showFiltering,
    headerStyle: tableHeader,
    paging: showPaging,
    rowStyle: (rowData, index) => {
      if (index % 2 === 0) {
        return row
      }
      return rowAlternate
    },
    search: showSearch,
    selection: showSelection,
    showTextRowsSelected,
    showTitle: showTitle,
    sorting: showSorting,
    toolbar: showToolbar,
    toolbarButtonAlignment,
  }
  return children({
    actions,
    columns,
    data,
    detailPanel,
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
    title,
  })
}
// PROPTYPES
const { array, bool, func, string, number, oneOf, oneOfType } = PropTypes
ListData.propTypes = {
  actions: array,
  actionsColumnIndex: number,
  children: func,
  columns: array,
  data: oneOfType([array, func]),
  detailPanel: oneOfType([array, func]),
  emptyRowsWhenPaging: bool,
  isDraggable: bool,
  onChangeColumnHidden: func,
  onChangePage: func,
  onChangeRowsPerPage: func,
  onColumnDragged: func,
  onGroupRemoved: func,
  onOrderChange: func,
  onRowClick: func,
  onSearchChange: func,
  onTreeExpandChange: func,
  showFiltering: bool,
  showPaging: bool,
  showSearch: bool,
  showSelection: bool,
  showSorting: bool,
  showTextRowsSelected: bool,
  showTitle: bool,
  showToolbar: bool,
  title: string,
  toolbarButtonAlignment: oneOf(['left', 'right']),
}
ListData.defaultProps = {
  actionsColumnIndex: 3,
  columns: [
    { title: 'Col 1', field: 'col1Data' },
    { title: 'Col 2', field: 'col2Data' },
  ],
  data: [{ col1Data: 'Col 1 data', col2Data: 'Col 2 data' }],
  emptyRowsWhenPaging: true,
  isDraggable: false,
  onChangeColumnHidden: () => {},
  onChangePage: () => {},
  onChangeRowsPerPage: () => {},
  onColumnDragged: () => {},
  onGroupRemoved: () => {},
  onOrderChange: () => {},
  // onRowClick: No defaultProp for onRowClick, when defined the entire row has a click pointer
  onSearchChange: () => {},
  onSelectionChange: () => {},
  onTreeExpandChange: () => {},
  showFiltering: false,
  showPaging: false,
  showSearch: false,
  showSelection: false,
  showSorting: false,
  showTextRowsSelected: false,
  showTitle: false,
  showToolbar: false,
  title: 'Table',
  toolbarButtonAlignment: 'left',
}

export default ListData
