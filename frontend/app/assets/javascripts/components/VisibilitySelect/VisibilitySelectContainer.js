import React from 'react'
import PropTypes from 'prop-types'
import VisibilitySelectPresentation from './VisibilitySelectPresentation'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'

/**
 * @summary VisibilitySelectContainer
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
      <VisibilitySelectPresentation docId={docId} docState={docState} handleVisibilityChange={handleVisibilityChange} />
    </PromiseWrapper>
  )
}
// PROPTYPES
const { string, object, func } = PropTypes
VisibilitySelectContainer.propTypes = {
  docId: string,
  docState: string,
  computeEntities: object,
  handleVisibilityChange: func,
}

VisibilitySelectContainer.defaultProps = {
  docId: '',
  docState: '',
  handleVisibilityChange: () => {},
}

export default VisibilitySelectContainer
