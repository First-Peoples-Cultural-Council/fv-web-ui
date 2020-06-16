import React from 'react'
// import PropTypes from 'prop-types'
import PhrasesFilteredByCategoryListPresentation from './PhrasesFilteredByCategoryListPresentation'
import PhrasesFilteredByCategoryListData from './PhrasesFilteredByCategoryListData'

/**
 * @summary PhrasesFilteredByCategoryListContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function PhrasesFilteredByCategoryListContainer() {
  return (
    <PhrasesFilteredByCategoryListData>
      {(PhrasesFilteredByCategoryListDataOutput) => {
        // TODO FW-1607
        // eslint-disable-next-line
        console.log('PhrasesFilteredByCategoryListDataOutput', PhrasesFilteredByCategoryListDataOutput)
        return <PhrasesFilteredByCategoryListPresentation />
      }}
    </PhrasesFilteredByCategoryListData>
  )
}
// PROPTYPES
// const { string } = PropTypes
PhrasesFilteredByCategoryListContainer.propTypes = {
  //   something: string,
}

export default PhrasesFilteredByCategoryListContainer
