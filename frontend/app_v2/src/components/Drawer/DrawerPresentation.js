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
              enter="transform transition ease-in-out duration-100 sm:duration-200"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-100 sm:duration-200"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-screen max-w-2xl">
                <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
                  <div className="flex justify-end mt-12 mr-2">
                    <button
                      className="bg-white h-7 rounded-md text-fv-charcoal-light hover:text-fv-charcoal focus:outline-black"
                      onClick={closeHandler}
                    >
                      <span className="sr-only">Close panel</span>
                      {useIcon('Close', 'h-7 w-7')}
                    </button>
                  </div>
                  {children}
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
