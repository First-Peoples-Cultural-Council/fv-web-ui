import React from 'react'
import PropTypes from 'prop-types'
import VisibilitySelectPresentation from './VisibilitySelectPresentation'
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
function VisibilitySelectContainer({ docVisibility, handleVisibilityChange, computeEntities }) {
  return (
    <PromiseWrapper renderOnError computeEntities={computeEntities}>
      <VisibilitySelectPresentation visibility={docVisibility} handleChange={handleVisibilityChange} />
    </PromiseWrapper>
  )
}
// PROPTYPES
const { string, object, func } = PropTypes
VisibilitySelectContainer.propTypes = {
  docVisibility: string,
  handleVisibilityChange: func,
  computeEntities: object,
}

VisibilitySelectContainer.defaultProps = {
  docVisibility: '',
  handleVisibilityChange: () => {},
}

export default VisibilitySelectContainer
