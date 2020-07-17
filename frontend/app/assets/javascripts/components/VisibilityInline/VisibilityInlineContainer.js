import React from 'react'
import PropTypes from 'prop-types'

// FPCC
import VisibilityInlinePresentation from 'components/VisibilityInline/VisibilityInlinePresentation'
import VisibilityInlineData from 'components/VisibilityInline/VisibilityInlineData'
import VisibilitySelect from 'components/VisibilitySelect'

/**
 * @summary VisibilityInlineContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function VisibilityInlineContainer({ docId, docState, computeEntities }) {
  return (
    <VisibilityInlineData docId={docId} docState={docState}>
      {({ dialectName, docVisibility, handleVisibilityChange }) => {
        return (
          <div>
            <VisibilityInlinePresentation dialectName={dialectName} docVisibility={docVisibility} />
            <VisibilitySelect.Container
              docVisibility={docVisibility}
              handleVisibilityChange={handleVisibilityChange}
              computeEntities={computeEntities}
            />
          </div>
        )
      }}
    </VisibilityInlineData>
  )
}
// PROPTYPES
const { string, object } = PropTypes
VisibilityInlineContainer.propTypes = {
  docId: string,
  docState: string,
  computeEntities: object,
}

VisibilityInlineContainer.defaultProps = {
  docId: '',
  docState: '',
}

export default VisibilityInlineContainer
