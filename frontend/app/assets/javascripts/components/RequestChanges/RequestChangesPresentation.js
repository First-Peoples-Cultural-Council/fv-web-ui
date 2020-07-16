import React from 'react'
// import PropTypes from 'prop-types'
import '!style-loader!css-loader!./RequestChanges.css'
import FVButton from 'views/components/FVButton'
import Textarea from 'views/components/Form/Common/Textarea'
import {getError, getErrorFeedback} from 'common/FormHelpers'

/**
 * @summary RequestChangesPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function RequestChangesPresentation({formRef, onSubmit, errors}) {

  return (
      <div className="RequestChanges">
        <form name="requestChanges" onSubmit={onSubmit} ref={formRef}>
          <Textarea
              labelText="Comments (requested changes)"
              id="commentField"
              name="commentField"
              error={getError({errors, fieldName: 'commentField'})}>
          </Textarea>
          {getErrorFeedback({errors})}
          <div className="actions">
            <select name="visibility">
              <option value="team">Team Only</option>
              <option value="members">Members Only</option>
              <option value="public">Public</option>
            </select>
            <FVButton
                variant="outlined"
                type="submit"
                color="secondary"
                className="FVButton"
                onClick={() => {
                  console.log("hi from onclick")
                }}
            >
              Approve
            </FVButton>
            <FVButton
                variant="outlined"
                type="submit"
                color="secondary"
                className="FVButton"
                onClick={() => {
                  console.log("hi from onclick")
                }}
            >
              Request Changes
            </FVButton>

          </div>
        </form>
      </div>

  )
}

// PROPTYPES
// const { string } = PropTypes
RequestChangesPresentation.propTypes = {
  //   something: string,
}

export default RequestChangesPresentation
