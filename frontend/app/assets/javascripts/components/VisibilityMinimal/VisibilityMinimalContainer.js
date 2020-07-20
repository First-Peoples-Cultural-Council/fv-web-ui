import React from 'react'
import PropTypes from 'prop-types'

// FPCC
import VisibilityMinimalPresentation from 'components/VisibilityMinimal/VisibilityMinimalPresentation'
import VisibilityMinimalData from 'components/VisibilityMinimal/VisibilityMinimalData'

/**
 * @summary VisibilityMinimalContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function VisibilityMinimalContainer({ docId, docState, computeEntities }) {
  return (
    <VisibilityMinimalData docId={docId} docState={docState}>
      {({
        workspaces,
        dialectName,
        dialogContent,
        docVisibility,
        handleVisibilityChange,
        handleDialogCancel,
        handleDialogOk,
        handleSnackbarClose,
        snackbarOpen,
        isDialogOpen,
        writePrivileges,
      }) => {
        return workspaces ? (
          <div>
            <VisibilityMinimalPresentation
              computeEntities={computeEntities}
              dialectName={dialectName}
              dialogContent={dialogContent}
              docVisibility={docVisibility}
              handleVisibilityChange={handleVisibilityChange}
              handleDialogCancel={handleDialogCancel}
              handleDialogOk={handleDialogOk}
              handleSnackbarClose={handleSnackbarClose}
              snackbarOpen={snackbarOpen}
              isDialogOpen={isDialogOpen}
              writePrivileges={writePrivileges}
            />
          </div>
        ) : null
      }}
    </VisibilityMinimalData>
  )
}
// PROPTYPES
const { string, object } = PropTypes
VisibilityMinimalContainer.propTypes = {
  docId: string,
  docState: string,
  computeEntities: object,
}

VisibilityMinimalContainer.defaultProps = {
  docId: '',
  docState: '',
}

export default VisibilityMinimalContainer
