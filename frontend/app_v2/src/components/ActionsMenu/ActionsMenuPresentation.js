import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Menu, Transition } from '@headlessui/react'

// FPCC
import useIcon from 'common/useIcon'

import Actions from 'components/Actions'
/**
 * @summary ActionsMenuPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function ActionsMenuPresentation({
  documentId,
  documentTitle,
  actions,
  moreActions,
  withLabels,
  withConfirmation,
  withTooltip,
}) {
  return (
    <div className="ActionsMenu">
      {actions.includes('copy') ? (
        <span className="ml-3 inline-flex sm:ml-0 border-l border-gray-300">
          <div className="relative inline-block text-left">
            <Actions.Copy
              docId={documentId}
              docTitle={documentTitle}
              withLabels={withLabels}
              withConfirmation={withConfirmation}
              withTooltip={withTooltip}
            />
          </div>
        </span>
      ) : null}
      {actions.includes('share') ? (
        <span className="ml-3 inline-flex sm:ml-0 border-l border-gray-300">
          <div className="relative inline-block text-left">
            <Actions.Share docId={documentId} docTitle={documentTitle} withLabels={withLabels} />
          </div>
        </span>
      ) : null}
      {/* More Menu button and items */}
      {moreActions.length > 0 ? (
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
                    <Menu.Item>
                      {({ active }) => (
                        <span
                          className={classNames(
                            active ? 'bg-gray-100 text-fv-charcoal' : 'text-fv-charcoal-light',
                            'w-full group flex items-center px-4 py-2 text-sm uppercase'
                          )}
                        >
                          <Actions.Share docId={documentId} docTitle={documentTitle} withLabels={withLabels} />
                        </span>
                      )}
                    </Menu.Item>
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
ActionsMenuPresentation.propTypes = {
  documentId: string,
  documentTitle: string,
  actions: array,
  moreActions: array,
  withLabels: bool,
  withConfirmation: bool,
  withTooltip: bool,
}

export default ActionsMenuPresentation
