import React from 'react'
// import PropTypes from 'prop-types'
import ListPresentation from 'components/List/ListPresentation'
import ListData from 'components/List/ListData'

/**
 * @summary ListContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ListContainer() {
  const { exampleOutput } = ListData({ exampleInput: 'passedInToData' })
  return <ListPresentation exampleProp={exampleOutput} />
}
// PROPTYPES
// const { string } = PropTypes
ListContainer.propTypes = {
  //   something: string,
}

export default ListContainer
