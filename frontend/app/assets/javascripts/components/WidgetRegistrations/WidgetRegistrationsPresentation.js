import React from 'react'
import PropTypes from 'prop-types'

import Widget from 'components/Widget'
import Table from 'components/Table'
import Link from 'views/components/Link'
import '!style-loader!css-loader!./WidgetRegistrations.css'

import { TABLE_FULL_WIDTH, WIDGET_WORKSPACE /*, URL_QUERY_PLACEHOLDER*/ } from 'common/Constants'
/**
 * @summary WidgetRegistrationsPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {array} props.columns Data for header/columns
 * @param {array} props.data Data for rows
 * @param {array} props.fetchMessage any fetch message from the server
 * @param {array} props.isFetching flag for in-progress server request
 * @param {function} props.onRowClick
 * @param {object} props.options Mat-table options
 *
 * @returns {node} jsx markup
 */

function WidgetRegistrationsPresentation({
  columns,
  data,
  fetchMessage,
  isFetching,
  onChangePage,
  onOrderChange,
  onRowClick,
  options,
  sortDirection,
  urlAllItems,
}) {
  return (
    <Widget.Presentation
      className="WidgetRegistrations"
      title="Registrations"
      variant={TABLE_FULL_WIDTH}
      childrenHeader={
        urlAllItems ? (
          <Link className="Widget__headerLink" href={`${urlAllItems}?page=1&pageSize=10&sortBy=date&sortOrder=desc`}>
            View full list
          </Link>
        ) : (
          undefined
        )
      }
    >
      <Table.Presentation
        columns={columns}
        data={data}
        localization={{
          body: {
            emptyDataSourceMessage: isFetching ? fetchMessage : 'No registrations pending',
          },
        }}
        onChangePage={onChangePage}
        onOrderChange={onOrderChange}
        onRowClick={onRowClick}
        options={options}
        sortDirection={sortDirection}
        variant={WIDGET_WORKSPACE}
      />
    </Widget.Presentation>
  )
}
// PROPTYPES
const { array, bool, func, object, string, oneOfType } = PropTypes
WidgetRegistrationsPresentation.propTypes = {
  columns: array,
  data: oneOfType([array, func]),
  fetchMessage: string,
  isFetching: bool,
  onChangePage: func,
  onChangeRowsPerPage: func,
  onRowClick: func,
  onOrderChange: func,
  options: object,
  sortDirection: string,
  urlAllItems: string,
}

export default WidgetRegistrationsPresentation
