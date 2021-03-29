import React from 'react'
// import PropTypes from 'prop-types'
import ListsPresentation from 'components/Lists/ListsPresentation'
import ListsData from 'components/Lists/ListsData'

/**
 * @summary ListsContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ListsContainer() {
  const { exampleOutput } = ListsData({ exampleInput: 'passedInToData' })
  return <ListsPresentation exampleProp={exampleOutput} />
}
// PROPTYPES
// const { string } = PropTypes
ListsContainer.propTypes = {
  //   something: string,
}

export default ListsContainer
