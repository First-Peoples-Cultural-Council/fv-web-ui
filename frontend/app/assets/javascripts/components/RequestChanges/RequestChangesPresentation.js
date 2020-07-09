import React from 'react'
// import PropTypes from 'prop-types'
import '!style-loader!css-loader!./RequestChanges.css'
import FVButton from 'views/components/FVButton'

/**
 * @summary RequestChangesPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function RequestChangesPresentation() {

  return (
      <div className="RequestChanges">
        <div>Comments (requested changes)</div>
        <input type="text"></input>
        <FVButton
            variant="outlined"
            color="secondary"
            className="Tasks__taskTitle"
            onClick={() => {
              /* ... */
            }}
        >
          Approve
        </FVButton>
        <FVButton
            variant="outlined"
            color="secondary"
            className="Tasks__taskTitle"
            onClick={() => {
              /* ... */
            }}
        >
          Request Changes
        </FVButton>
      </div>

  )
}

// PROPTYPES
// const { string } = PropTypes
RequestChangesPresentation.propTypes = {
  //   something: string,
}

export default RequestChangesPresentation
