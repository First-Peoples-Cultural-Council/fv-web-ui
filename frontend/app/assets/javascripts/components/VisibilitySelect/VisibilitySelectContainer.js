import React from 'react'
import PropTypes from 'prop-types'
import VisibilitySelectPresentation from './VisibilitySelectPresentation'
import VisibilitySelectData from './VisibilitySelectData'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'

/**
 * @summary VisibilitySelectContainer - a simple selct menu for displaying and selecting the visibility of a document that it is passed as a prop. DOES NOT handle network calls.
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function VisibilitySelectContainer({ docId, docState, handleVisibilityChange, computeEntities }) {
  return (
    <PromiseWrapper renderOnError computeEntities={computeEntities}>
      <VisibilitySelectData docId={docId} docState={docState} handleVisibilityChange={handleVisibilityChange}>
        {({ handleChange, visibility }) => {
          // Getting visibility
          if (!visibility || !docId) {
            return null
          }
          return <VisibilitySelectPresentation visibility={visibility} handleChange={handleChange} />
        }}
      </VisibilitySelectData>
    </PromiseWrapper>
  )
}
// PROPTYPES
const { string, object, func } = PropTypes
VisibilitySelectContainer.propTypes = {
  docId: string,
  docState: string,
  handleVisibilityChange: func,
  computeEntities: object,
}

VisibilitySelectContainer.defaultProps = {
  docId: '',
  docState: '',
  handleVisibilityChange: () => {},
}

export default VisibilitySelectContainer
