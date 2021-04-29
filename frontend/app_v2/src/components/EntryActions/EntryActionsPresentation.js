import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Menu, Transition } from '@headlessui/react'

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
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

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
                  } text-sm font-medium text-fv-charcoal-light hover:text-fv-charcoal bg-white`}
                  onClick={() => clickHandler(documentTitle, documentId)}
                >
                  <span className="sr-only">{actionTitle}</span>
                  {useIcon(iconName, 'fill-current h-8 w-8 md:h-6 md:w-6')}
                  {withLabels ? (
                    <>
                      <span className="ml-2 font-semibold uppercase bg-white text-fv-charcoal-light">
                        {actionTitle}
                      </span>
                      <span id={`${actionTitle}-message-${documentId}`} className="hidden">
                        <span className="absolute bottom-2 right-0 font-semibold uppercase bg-white text-fv-charcoal-light">
                          {confirmationMessage}
                        </span>
                      </span>
                    </>
                  ) : null}
                  {withConfirmation ? (
                    <>
                      <span id={`${actionTitle}-message-${documentId}`} className="hidden">
                        <div className="absolute bottom-1 -right-1 w-auto p-1 text-sm bg-fv-charcoal-light text-white text-center rounded-lg shadow-lg ">
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
      {/* More Menu button and items */}
      {moreActionsToShow.length > 0 ? (
        <Menu as="div" className="relative inline-block text-left">
          {({ open }) => (
            <>
              <div>
                <Menu.Button className="inline-flex justify-center w-full border-l border-gray-300 p-2 text-sm font-medium text-fv-charcoal-light hover:text-fv-charcoal bg-white">
                  {useIcon('More', 'fill-current h-8 w-8 md:h-6 md:w-6')}
                </Menu.Button>
              </div>

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items
                  static
                  className="z-10 origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div className="py-1">
                    {moreActionsToShow.map(({ actionTitle, iconName, clickHandler }, index) => (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <button
                            className={classNames(
                              active ? 'bg-gray-100 text-fv-charcoal' : 'text-fv-charcoal-light',
                              'w-full group flex items-center px-4 py-2 text-sm uppercase'
                            )}
                            onClick={() => clickHandler(documentTitle, documentId)}
                          >
                            <span className="sr-only">{actionTitle}</span>
                            {useIcon(iconName, 'fill-current mr-3 h-5 w-5')}
                            {actionTitle}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      ) : null}
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
