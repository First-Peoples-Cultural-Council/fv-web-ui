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
        {({formRef, onSubmit, errors, computeEntities, handleVisibilityChange, docVisibility, docState, docId}) => {
          return <RequestChangesPresentation formRef={formRef}
                                             onSubmit={onSubmit}
                                             errors={errors}
                                             computeEntities={computeEntities}
                                             handleVisibilityChange={handleVisibilityChange}
                                             docVisibility={docVisibility}
                                             docState={docState}
                                             docId={docId}
          />
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
