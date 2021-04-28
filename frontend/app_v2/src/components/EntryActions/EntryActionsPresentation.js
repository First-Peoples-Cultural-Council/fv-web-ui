import React from 'react'
import PropTypes from 'prop-types'

// FPCC
import useIcon from 'common/useIcon'
/**
 * @summary EntryActionsPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function EntryActionsPresentation({
  documentId,
  documentTitle,
  actionsToShow,
  moreActionsToShow,
  withLabels,
  withConfirmation,
}) {
  return (
    <div className="EntryActions">
      {actionsToShow
        ? actionsToShow.map(({ actionTitle, iconName, clickHandler, confirmationMessage }, index) => (
            <span key={index} className="ml-3 inline-flex sm:ml-0">
              <div className="relative inline-block text-left">
                <button
                  className={`relative inline-flex items-center p-2 ${
                    index === actionsToShow.length - 1 ? '' : 'border-r border-gray-300'
                  } text-sm font-medium text-fv-blue-dark hover:text-fv-blue-light bg-white hover:bg-gray-50`}
                  onClick={() => clickHandler(documentTitle, documentId)}
                >
                  <span className="sr-only">{actionTitle}</span>
                  {useIcon(iconName, 'fill-current h-8 w-8 md:h-6 md:w-6')}
                  {withLabels ? (
                    <>
                      <span className="ml-2 font-semibold uppercase bg-white text-fv-blue-dark">{actionTitle}</span>
                      <span id={`${actionTitle}-message-${documentId}`} className="hidden">
                        <span className="absolute bottom-2 right-0 font-semibold uppercase bg-white text-fv-blue-dark">
                          {confirmationMessage}
                        </span>
                      </span>
                    </>
                  ) : null}
                  {withConfirmation ? (
                    <>
                      <span id={`${actionTitle}-message-${documentId}`} className="hidden">
                        <div className="absolute bottom-1 -right-1 w-auto p-1 text-sm bg-fv-blue-dark text-white text-center rounded-lg shadow-lg ">
                          {confirmationMessage}
                        </div>
                      </span>
                    </>
                  ) : null}
                </button>
              </div>
            </span>
          ))
        : null}
      {moreActionsToShow
        ? moreActionsToShow.map(({ actionTitle }, index) => <span key={index}>{actionTitle}</span>)
        : null}
    </div>
  )
}
// PROPTYPES
const { array, bool, string } = PropTypes
EntryActionsPresentation.propTypes = {
  documentId: string,
  documentTitle: string,
  actionsToShow: array,
  moreActionsToShow: array,
  withLabels: bool,
  withConfirmation: bool,
}

export default EntryActionsPresentation
