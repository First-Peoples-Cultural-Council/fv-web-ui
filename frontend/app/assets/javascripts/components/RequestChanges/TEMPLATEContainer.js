import React from 'react'
// import PropTypes from 'prop-types'
import RequestChangesPresentation
  from 'components/RequestChanges/RequestChangesPresentation'
import RequestChangesData from 'components/RequestChanges/RequestChangesData'

/**
 * @summary RequestChangesContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function RequestChangesContainer() {
  return (
      <RequestChangesData>
        {(RequestChangesDataOutput) => {
          // TODO FW-RequestChanges
          // eslint-disable-next-line
          console.log('RequestChangesDataOutput', RequestChangesDataOutput)
          return <RequestChangesPresentation/>
        }}
      </RequestChangesData>
  )
}

// PROPTYPES
// const { string } = PropTypes
RequestChangesContainer.propTypes = {
  //   something: string,
}

export default RequestChangesContainer
