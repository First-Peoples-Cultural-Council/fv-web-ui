import React from 'react'
import PropTypes from 'prop-types'
import VisibilitySelectPresentation from './VisibilitySelectPresentation'
import VisibilitySelectData from './VisibilitySelectData'
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
function VisibilitySelectContainer({ docId, docState, computeEntities }) {
  return (
    <PromiseWrapper renderOnError computeEntities={computeEntities}>
      <VisibilitySelectData docId={docId} docState={docState}>
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
const { string, object } = PropTypes
VisibilitySelectContainer.propTypes = {
  docId: string,
  docState: string,
  computeEntities: object,
}

VisibilitySelectContainer.defaultProps = {
  docId: '',
  docState: '',
}

export default VisibilitySelectContainer
