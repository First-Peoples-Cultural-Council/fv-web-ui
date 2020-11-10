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
 * @param {string} docId UID of the document that is being viewed
 * @param {string} docState The nuxeo 'state' of the document: 'New', 'Enabled', 'Disabled', or 'Published'.
 * @param {object} computeEntities Immutable.fromJS object for the PromiseWrapper component which is rendered by the VisibilitySelectContainer
 *
 * @returns {node} jsx markup
 */
function VisibilityMinimalContainer({ docId, docState, computeEntities, unpublishCallback }) {
  return (
    <VisibilityMinimalData docId={docId} docState={docState} unpublishCallback={unpublishCallback}>
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
        ) : null
      }}
    </VisibilityMinimalData>
  )
}
// PROPTYPES
const { func, string, object } = PropTypes
VisibilityMinimalContainer.propTypes = {
  docId: string,
  docState: string,
  computeEntities: object,
  unpublishCallback: func,
}

VisibilityMinimalContainer.defaultProps = {
  docId: '',
  docState: '',
  unpublishCallback: () => {},
}

export default VisibilityMinimalContainer
