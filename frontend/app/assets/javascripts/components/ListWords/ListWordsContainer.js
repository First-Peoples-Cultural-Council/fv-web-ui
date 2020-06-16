import React from 'react'
// import PropTypes from 'prop-types'
import ListWordsPresentation from './ListWordsPresentation'
import ListWordsData from './ListWordsData'

/**
 * @summary ListWordsContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ListWordsContainer() {
  return (
    <ListWordsData>
      {(ListWordsDataOutput) => {
        // TODO FW-1607
        // eslint-disable-next-line
        console.log('ListWordsDataOutput', ListWordsDataOutput)
        return <ListWordsPresentation />
      }}
    </ListWordsData>
  )
}
// PROPTYPES
// const { string } = PropTypes
ListWordsContainer.propTypes = {
  //   something: string,
}

export default ListWordsContainer
