import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'

// FPCC
import useIcon from 'common/useIcon'
import ShareComponent from 'components/Share'
import { Dialog, Transition } from '@headlessui/react'

/**
 * @summary Share
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */

function Share({ docId, docTitle, withLabels }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        id="ShareAction"
        className="relative inline-flex items-center p-2 text-sm font-medium text-fv-charcoal-light hover:text-fv-charcoal"
        onClick={() => setOpen(!open)}
      >
        <span className="sr-only">Share</span>
        {useIcon('WebShare', 'fill-current h-8 w-8 md:h-6 md:w-6')}
        {withLabels ? <span className="ml-2 font-semibold uppercase text-fv-charcoal-light">Share</span> : null}
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" static className="fixed z-10 inset-0 overflow-y-auto" open={open} onClose={setOpen}>
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      {`Share ${docTitle} on:`}
                    </Dialog.Title>
                    <div className="mt-2">
                      <ShareComponent.Container url={'someUrlHere' + docId} title={docTitle} />
                    </div>
                  </div>
                </div>
                <div className="mt-5 text-center sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center w-1/4 rounded-md border border-transparent shadow-sm px-4 py-2 bg-fv-orange text-base font-medium text-white hover:bg-fv-red-light sm:text-sm"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
// PROPTYPES
const { bool, string } = PropTypes
Share.propTypes = {
  docId: string,
  docTitle: string,
  withLabels: bool,
}

export default Share
