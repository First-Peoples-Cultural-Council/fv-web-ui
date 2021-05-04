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
    <div className="inline-flex">
      {actions.includes('copy') ? (
        <span className="sm:ml-3 inline-flex">
          <Actions.Copy
            docId={documentId}
            docTitle={documentTitle}
            withLabels={withLabels}
            withConfirmation={withConfirmation}
            withTooltip={withTooltip}
          />
        </span>
      ) : null}
      {actions.includes('share') ? (
        <span className="ml-3 pl-2 inline-flex border-l border-gray-300">
          <Actions.Share docId={documentId} docTitle={documentTitle} withLabels={withLabels} />
        </span>
      ) : null}
      {/* More Menu button and items */}
      {moreActions.length > 0 ? (
        <Menu as="div" className="relative inline-flex text-left">
          {({ open }) => (
            <>
              <span className="ml-3 pl-2 inline-flex border-l border-gray-300">
                <Menu.Button className="relative inline-flex items-center text-sm font-semibold uppercase text-fv-charcoal hover:text-black">
                  {useIcon('More', 'fill-current h-8 w-8 md:h-6 md:w-6')}
                  <span className="ml-2">More</span>
                </Menu.Button>
              </span>

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
                  className="z-10 origin-top-right absolute top-5 right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
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
