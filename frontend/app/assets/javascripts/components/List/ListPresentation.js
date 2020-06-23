import React from 'react'
import PropTypes from 'prop-types'
import MaterialTable from 'material-table'

/**
 * @summary ListPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ListPresentation({ columns, data, title }) {
  return (
    <div>
      <h1>ListPresentation</h1>
      <MaterialTable columns={columns} data={data} title={title} />
    </div>
  )
}
// PROPTYPES
const { array, string } = PropTypes
ListPresentation.propTypes = {
  columns: array,
  data: array,
  title: string,
}

export default ListPresentation
