import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { Menu, Transition } from '@headlessui/react'

// FPCC
import useIcon from 'common/useIcon'
import { makePlural } from 'common/urlHelpers'
import Actions from 'components/Actions'
import Share from 'components/Share'
import Modal from 'components/Modal'
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
  docId,
  docTitle,
  docType,
  actions,
  moreActions,
  withLabels,
  withConfirmation,
  withTooltip,
}) {
  const [shareModelOpen, setShareModalOpen] = useState(false)
  return (
    <div className="inline-flex">
      {/* Pinned Action Buttons */}
      {actions.includes('copy') ? (
        <Actions.Copy
          docId={docId}
          docTitle={docTitle}
          withLabels={withLabels}
          withConfirmation={withConfirmation}
          withTooltip={withTooltip}
        />
      ) : null}
      {actions.includes('share') && (
        <button
          id="ShareAction"
          className="ml-2 pl-2 relative inline-flex items-center text-sm font-semibold uppercase text-fv-charcoal hover:text-black border-l border-gray-300"
          onClick={() => setShareModalOpen(true)}
        >
          <span className="sr-only">Share</span>
          {useIcon('WebShare', 'fill-current h-8 w-8 md:h-6 md:w-6')}
          {withLabels ? <span className="mx-2">Share</span> : null}
        </button>
      )}

      {/* More Menu button and Action items */}
      {moreActions.length > 0 ? (
        <Menu as="div" className="relative inline-flex text-left">
          {({ open }) => (
            <>
              <Menu.Button className="ml-2 pl-2 relative inline-flex items-center text-sm font-semibold uppercase text-fv-charcoal hover:text-black border-l border-gray-300">
                {useIcon('More', 'fill-current h-8 w-8 md:h-6 md:w-6')}
                {withLabels ? <span className="mx-2">More</span> : null}
              </Menu.Button>

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
                    {moreActions.includes('share') && (
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            id="ShareAction"
                            className={classNames(
                              active ? 'bg-gray-100 text-fv-charcoal' : 'text-fv-charcoal-light',
                              'w-full group flex items-center px-4 py-2 text-sm uppercase'
                            )}
                            onClick={() => setShareModalOpen(true)}
                          >
                            <span className="sr-only">Share</span>
                            {useIcon('WebShare', 'fill-current h-8 w-8 md:h-6 md:w-6')}
                            <span className="ml-2">Share</span>
                          </button>
                        )}
                      </Menu.Item>
                    )}
                  </div>
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      ) : null}
      {/* Share Modal */}
      <Modal.Presentation isOpen={shareModelOpen} closeHandler={() => setShareModalOpen(false)}>
        <h3 className="mb-1 text-xl font-medium text-fv-charcoal">
          Share <em>{docTitle}</em> on:
        </h3>
        <Share.Container
          url={`${window.location.origin.toString()}/${makePlural(docType)}/${docId}`}
          title={docTitle}
        />
      </Modal.Presentation>
    </div>
  )
}
// PROPTYPES
const { array, bool, string } = PropTypes
ActionsMenuPresentation.propTypes = {
  docId: string,
  docTitle: string,
  docType: string,
  actions: array,
  moreActions: array,
  withLabels: bool,
  withConfirmation: bool,
  withTooltip: bool,
}

export default ActionsMenuPresentation
