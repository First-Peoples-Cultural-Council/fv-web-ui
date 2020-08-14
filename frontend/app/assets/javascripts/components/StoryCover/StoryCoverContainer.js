import React from 'react'
// import PropTypes from 'prop-types'
import StoryCoverPresentation from 'components/StoryCover/StoryCoverPresentation'
import StoryCoverData from 'components/StoryCover/StoryCoverData'

/**
 * @summary StoryCoverContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function StoryCoverContainer({ book, openBookAction }) {
  return (
    <StoryCoverData book={book}>
      {() => {
        return <StoryCoverPresentation book={book} openBookAction={openBookAction} />
      }}
    </StoryCoverData>
  )
}
// PROPTYPES
// const { object } = PropTypes
StoryCoverContainer.propTypes = {
  //   something: object,
}

export default StoryCoverContainer
