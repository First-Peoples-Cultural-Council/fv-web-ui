import React from 'react'
import PropTypes from 'prop-types'

// FPCC
import VisibilityInlinePresentation from 'components/VisibilityInline/VisibilityInlinePresentation'
import VisibilityInlineData from 'components/VisibilityInline/VisibilityInlineData'

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
      {({
        workspaces,
        dialectName,
        docVisibility,
        handleVisibilityChange,
        handleDialogCancel,
        handleDialogOk,
        isDialogOpen,
        writePrivileges,
      }) => {
        return workspaces ? (
          <div>
            <VisibilityInlinePresentation
              computeEntities={computeEntities}
              dialectName={dialectName}
              docVisibility={docVisibility}
              handleVisibilityChange={handleVisibilityChange}
              handleDialogCancel={handleDialogCancel}
              handleDialogOk={handleDialogOk}
              isDialogOpen={isDialogOpen}
              writePrivileges={writePrivileges}
            />
          </div>
        ) : null
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
