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
        {({computeEntities, docId, docState, docVisibility, errors, formRef, handleVisibilityChange, onSubmit}) => {
          return <RequestChangesPresentation computeEntities={computeEntities}
                                             docId={docId}
                                             docState={docState}
                                             docVisibility={docVisibility}
                                             errors={errors}
                                             formRef={formRef}
                                             handleVisibilityChange={handleVisibilityChange}
                                             onSubmit={onSubmit}


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
