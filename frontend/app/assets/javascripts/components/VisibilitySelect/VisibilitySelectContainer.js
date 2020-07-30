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
 * @param {string} docVisibility A string with the value of 'teams', 'members', or, 'public that reflects the visibility of the document being viewed.
 * @param {function} handleVisibilityChange A function to handle the onChange of the select component
 * @param {object} computeEntities An Immutable.fromJS object required by the PromiseWrapper Component
 *
 * @returns {node} jsx markup
 */
function VisibilitySelectContainer({ docVisibility, handleVisibilityChange, computeEntities, hideLabel }) {
  return (
    <PromiseWrapper renderOnError computeEntities={computeEntities}>
      <VisibilitySelectPresentation
        docVisibility={docVisibility}
        handleVisibilityChange={handleVisibilityChange}
        hideLabel={hideLabel}
      />
    </PromiseWrapper>
  )
}
// PROPTYPES
const { string, object, func, bool } = PropTypes
VisibilitySelectContainer.propTypes = {
  docVisibility: string.isRequired,
  handleVisibilityChange: func.isRequired,
  hideLabel: bool,
  computeEntities: object.isRequired,
}

VisibilitySelectContainer.defaultProps = {
  docVisibility: '',
  handleVisibilityChange: () => {},
  hideLabel: false,
}

export default VisibilitySelectContainer
