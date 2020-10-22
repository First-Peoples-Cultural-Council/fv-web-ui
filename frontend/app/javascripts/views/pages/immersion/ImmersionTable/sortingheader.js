import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Tooltip from '@material-ui/core/Tooltip'

export default class SortingHeader extends Component {
  static propTypes = {
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    columns: PropTypes.array.isRequired,
  }

  createSortHandler = (property) => (event) => {
    this.props.onRequestSort(event, property)
  }

  render() {
    const { order, orderBy, columns } = this.props

    return (
      <TableHead className="data-table">
        <TableRow className="DictionaryList__row DictionaryList__row--header">
          {columns.map((column) => {
            return (
              <TableCell
                className={`DictionaryList__data DictionaryList__data--${column.id} DictionaryList__header`}
                key={column.id}
                // numeric={column.numeric}
                padding={column.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === column.id ? order : false}
              >
                {!column.noSort ? (
                  <Tooltip title="Sort" placement={column.numeric ? 'bottom-end' : 'bottom-start'} enterDelay={300}>
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={order}
                      onClick={this.createSortHandler(column.id)}
                      className="DictionaryList__data"
                    >
                      {column.label}
                    </TableSortLabel>
                  </Tooltip>
                ) : (
                  <div className="DictionaryList__data">{column.label}</div>
                )}
              </TableCell>
            )
          }, this)}
        </TableRow>
      </TableHead>
    )
  }
}
