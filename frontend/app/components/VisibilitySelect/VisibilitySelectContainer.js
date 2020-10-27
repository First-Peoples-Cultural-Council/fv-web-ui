import React from 'react'
import PropTypes from 'prop-types'
import VisibilitySelectData from './VisibilitySelectData'
import VisibilitySelectPresentation from './VisibilitySelectPresentation'
import PromiseWrapper from 'components/PromiseWrapper'

/**
 * @summary VisibilitySelectContainer - a simple selct menu for displaying and selecting the visibility of a document that it is passed as a prop. DOES NOT handle network calls.
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {string} docVisibility A string with the value of 'teams', 'members', or, 'public that reflects the visibility of the document being viewed.
 * @param {function} handleVisibilityChange A function to handle the onChange of the select component
 * @param {object} computeEntities An Immutable.fromJS object required by the PromiseWrapper Component
 * @param {boolean} hideLabel If true the label: "Who can see this?", will be hidden
 *
 * @returns {node} jsx markup
 */
function VisibilitySelectContainer({
  computeEntities,
  dialectName,
  docVisibility,
  handleVisibilityChange,
  hideLabel,
  selectNameAndId,
  selectLabelText,
}) {
  return (
    <PromiseWrapper renderOnError computeEntities={computeEntities}>
      <VisibilitySelectData>
        {({ publicDialect, isLoading }) => {
          return isLoading ? (
            <div>Loading...</div>
          ) : (
            <VisibilitySelectPresentation
              docVisibility={docVisibility}
              handleVisibilityChange={handleVisibilityChange}
              hideLabel={hideLabel}
              publicDialect={publicDialect}
              selectNameAndId={selectNameAndId}
              selectLabelText={selectLabelText}
              dialectName={dialectName}
            />
          )
        }}
      </VisibilitySelectData>
    </PromiseWrapper>
  )
}
// PROPTYPES
const { string, object, func, bool } = PropTypes
VisibilitySelectContainer.propTypes = {
  computeEntities: object.isRequired,
  dialectName: string,
  docVisibility: string.isRequired,
  handleVisibilityChange: func.isRequired,
  hideLabel: bool,
  selectNameAndId: string,
  selectLabelText: string,
}

VisibilitySelectContainer.defaultProps = {
  docVisibility: '',
  handleVisibilityChange: () => {},
  hideLabel: false,
}

export default VisibilitySelectContainer
