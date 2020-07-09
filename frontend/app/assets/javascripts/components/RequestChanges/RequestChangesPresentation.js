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
        <h2>Comments (requested changes)</h2>
        <input type="text"></input>
        <div className="actions">
          <select name="visibility">
            <option value="team">Team Only</option>
            <option value="members">Members Only</option>
            <option value="public">Public</option>
          </select>
          <FVButton
              variant="outlined"
              color="secondary"
              className="FVButton"
              onClick={() => {
                /* ... */
              }}
          >
            Approve
          </FVButton>
          <FVButton
              variant="outlined"
              color="secondary"
              className="FVButton"
              onClick={() => {
                /* ... */
              }}
          >
            Request Changes
          </FVButton>

        </div>

      </div>

  )
}

// PROPTYPES
// const { string } = PropTypes
RequestChangesPresentation.propTypes = {
  //   something: string,
}

export default RequestChangesPresentation
