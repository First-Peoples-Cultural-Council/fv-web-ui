import React from 'react'
import PropTypes from 'prop-types'
import useIcon from 'common/useIcon'
/**
 * @summary ErrorHandlerPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ErrorHandlerPresentation({ status }) {
  return (
    <div className="min-w-screen min-h-screen bg-fv-turquoise-light flex items-center p-5 lg:p-20 overflow-hidden relative">
      <div className="w-full flex-1 min-h-full min-w-full rounded-3xl bg-white shadow-xl p-10 lg:p-20 text-gray-800 relative items-center text-center">
        {useIcon('Logo', 'h-24 mb-10 mx-auto')}
        <div className="mb-10 md:mb-20 text-gray-600 font-light">
          <h1 className="font-black uppercase text-3xl lg:text-5xl text-fv-turquoise mb-10">
            {status} You seem to be lost!
          </h1>
          <p>The page you&apos;re looking for isn&apos;t available.</p>
          <p>Try searching again or use the Go Back button below.</p>
        </div>
        <div className="mb-20 md:mb-0">
          <button className="text-lg font-light outline-none focus:outline-none transform transition-all hover:scale-110 text-fv-turquoise hover:text-fv-turquoise-dark">
            <i className="mdi mdi-arrow-left mr-2" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}
// PROPTYPES
const { string } = PropTypes
ErrorHandlerPresentation.propTypes = {
  exampleProp: string,
}

export default ErrorHandlerPresentation
