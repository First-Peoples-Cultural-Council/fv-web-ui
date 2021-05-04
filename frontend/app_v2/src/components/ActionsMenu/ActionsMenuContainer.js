import React from 'react'
import PropTypes from 'prop-types'
import ActionsMenuPresentation from 'components/ActionsMenu/ActionsMenuPresentation'

/**
 * @summary ActionsMenuContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ActionsMenuContainer({
  docId,
  docTitle,
  docType,
  actions = [],
  moreActions = [],
  withLabels = false,
  withConfirmation = false,
  withTooltip = false,
}) {
  return (
    <ActionsMenuPresentation
      docId={docId}
      docTitle={docTitle}
      docType={docType}
      actions={actions}
      moreActions={moreActions}
      withLabels={withLabels}
      withConfirmation={withConfirmation}
      withTooltip={withTooltip}
    />
  )
}
// PROPTYPES
const { array, bool, string } = PropTypes
ActionsMenuContainer.propTypes = {
  docId: string,
  docTitle: string,
  docType: string,
  actions: array,
  moreActions: array,
  withLabels: bool,
  withConfirmation: bool,
  withTooltip: bool,
}

export default ActionsMenuContainer
