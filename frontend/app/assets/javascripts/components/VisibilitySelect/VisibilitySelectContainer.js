import React from 'react'
import PropTypes from 'prop-types'
import VisibilitySelectPresentation from './VisibilitySelectPresentation'
import VisibilitySelectData from './VisibilitySelectData'

/**
 * @summary VisibilitySelectContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function VisibilitySelectContainer({ docId, docState }) {
  return (
    <VisibilitySelectData docId={docId} docState={docState}>
      {(VisibilitySelectDataOutput) => {
        // eslint-disable-next-line
        console.log('VisibilitySelectDataOutput', VisibilitySelectDataOutput)
        return <VisibilitySelectPresentation />
      }}
    </VisibilitySelectData>
  )
}
// PROPTYPES
const { string } = PropTypes
VisibilitySelectContainer.propTypes = {
  docId: string,
  docState: string,
}

VisibilitySelectContainer.defaultProps = {
  docId: '',
  docState: 'Enabled',
}

export default VisibilitySelectContainer
