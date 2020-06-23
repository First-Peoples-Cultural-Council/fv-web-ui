import React from 'react'
// import PropTypes from 'prop-types'
import ListPresentation from './ListPresentation'
import ListData from './ListData'

/**
 * @summary ListContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ListContainer() {
  return (
    <ListData>
      {({ columns, data, title }) => {
        return <ListPresentation title={title} data={data} columns={columns} />
      }}
    </ListData>
  )
}
// PROPTYPES
// const { string } = PropTypes
ListContainer.propTypes = {
  //   something: string,
}

export default ListContainer
