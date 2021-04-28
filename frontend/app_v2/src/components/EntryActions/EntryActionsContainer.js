import React from 'react'
import PropTypes from 'prop-types'
import EntryActionsPresentation from 'components/EntryActions/EntryActionsPresentation'
import EntryActionsData from 'components/EntryActions/EntryActionsData'

/**
 * @summary EntryActionsContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function EntryActionsContainer({
  documentId,
  documentTitle,
  actions,
  moreActions,
  withLabels = false,
  withConfirmation = false,
}) {
  const { actionsToShow, moreActionsToShow } = EntryActionsData({ actions, moreActions })
  return (
    <EntryActionsPresentation
      documentId={documentId}
      documentTitle={documentTitle}
      actionsToShow={actionsToShow}
      moreActionsToShow={moreActionsToShow}
      withLabels={withLabels}
      withConfirmation={withConfirmation}
    />
  )
}
// PROPTYPES
const { array, bool, string } = PropTypes
EntryActionsContainer.propTypes = {
  documentId: string,
  documentTitle: string,
  actions: array,
  moreActions: array,
  withLabels: bool,
  withConfirmation: bool,
}

export default EntryActionsContainer
