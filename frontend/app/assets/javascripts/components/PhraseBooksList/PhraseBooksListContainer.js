import React from 'react'
// import PropTypes from 'prop-types'
import PhraseBooksListPresentation from './PhraseBooksListPresentation'
import PhraseBooksListData from './PhraseBooksListData'

/**
 * @summary PhraseBooksListContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function PhraseBooksListContainer() {
  return (
    <PhraseBooksListData>
      {(PhraseBooksListDataOutput) => {
        // TODO: PLEASE REMOVE
        // eslint-disable-next-line
        console.log('PhraseBooksListDataOutput', PhraseBooksListDataOutput)
        return <PhraseBooksListPresentation />
      }}
    </PhraseBooksListData>
  )
}
// PROPTYPES
// const { string } = PropTypes
PhraseBooksListContainer.propTypes = {
  //   something: string,
}

export default PhraseBooksListContainer
