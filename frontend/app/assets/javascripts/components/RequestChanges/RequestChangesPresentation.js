import React from 'react'
// import PropTypes from 'prop-types'
import '!style-loader!css-loader!./RequestChanges.css'
import FVButton from 'views/components/FVButton'
import Textarea from 'views/components/Form/Common/Textarea'
import {getError, getErrorFeedback} from 'common/FormHelpers'
import VisibilitySelect from 'components/VisibilitySelect'
import PropTypes from 'prop-types'

/**
 * @summary RequestChangesPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function RequestChangesPresentation({formRef, onSubmit, errors, docVisibility, handleVisibilityChange, computeEntities}) {
  return (
      <div className="RequestChanges">
        <form name="requestChanges" onSubmit={onSubmit} ref={formRef}>
          <Textarea
              labelText="Comments (requested changes)"
              id="commentField"
              name="commentField"
              error={getError({errors, fieldName: 'commentField'})}/>
          <div className="visibilitySelector">
            <VisibilitySelect.Container
                docVisibility={docVisibility}
                handleVisibilityChange={handleVisibilityChange}
                computeEntities={computeEntities}
            />
          </div>
          {getErrorFeedback({errors})}
          <div className="actions">
            <FVButton
                variant="outlined"
                type="submit"
                color="secondary"
                className="FVButton"
                onClick={() => {
                  console.log('hi from onclick')
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
                  console.log('hi from onclick')
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
const {string, object} = PropTypes
RequestChangesPresentation.propTypes = {
  docId: string,
  docState: string,
  computeEntities: object,
}

RequestChangesPresentation.defaultProps = {
  docId: '',
  docState: '',
}

export default RequestChangesPresentation
