import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Dialog, Transition } from '@headlessui/react'
import useIcon from 'common/useIcon'

/**
 * @summary DrawerPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function DrawerPresentation({ children, isOpen, closeHandler }) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" static className="fixed inset-0 overflow-hidden" open={isOpen} onClose={closeHandler}>
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0" />

          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex sm:pl-16">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300 sm:duration-500"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-300 sm:duration-500"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-screen max-w-2xl">
                <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
                  <div className="px-4 sm:px-6 mt-14">
                    <div className="flex justify-end">
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          className="bg-white rounded-md text-fv-charcoal-light hover:text-fv-charcoal focus:outline-black"
                          onClick={closeHandler}
                        >
                          <span className="sr-only">Close panel</span>
                          {useIcon('Close', 'h-6 w-6')}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 relative flex-1 px-4 sm:px-6">{children}</div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
// PROPTYPES
const { bool, func, node } = PropTypes
DrawerPresentation.propTypes = {
  children: node,
  isOpen: bool,
  closeHandler: func,
}

DrawerPresentation.defaultProps = {
  isOpen: false,
}

export default DrawerPresentation
