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
 * @param {string} docVisibility A string with the value of 'teams', 'members', or, 'public
 * @param {function} handleVisibilityChange A function to handle the onChange of the select component
 * @param {object} computeEntities An Immutable.List() required by the PromiseWrapper
 *
 * @returns {node} jsx markup
 */
function VisibilitySelectContainer({ docVisibility, handleVisibilityChange, computeEntities }) {
  return (
    <PromiseWrapper renderOnError computeEntities={computeEntities}>
      <VisibilitySelectPresentation docVisibility={docVisibility} handleVisibilityChange={handleVisibilityChange} />
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
