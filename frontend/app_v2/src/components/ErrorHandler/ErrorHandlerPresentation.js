import React from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'

// FPCC
import useIcon from 'common/useIcon'
/**
 * @summary ErrorHandlerPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ErrorHandlerPresentation({ status, heading, content }) {
  const history = useHistory()
  return (
    <div className="min-w-screen min-h-screen bg-tertiaryB flex items-center p-5 lg:p-20 overflow-hidden relative">
      <div className="w-full flex-1 min-h-full min-w-full rounded-lg bg-white shadow-xl p-10 lg:p-20 text-gray-800 relative items-center text-center">
        <h1 className="font-black text-3xl lg:text-5xl text-fv-charcoal mb-10">Oops! We&apos;ve found a problem...</h1>
        <div className="mb-10 text-gray-600 font-light">
          <h1 className="font-black uppercase text-3xl lg:text-5xl text-tertiaryB mb-5">
            {status} {heading}
          </h1>
          <div className="text-lg text-fv-charcoal">{content}</div>
        </div>
        <div className="mb-5 md:mb-10">
          <button
            className="text-lg font-light outline-none focus:outline-none transform transition-all hover:scale-110 text-tertiaryB hover:text-tertiaryB-dark"
            onClick={() => history.goBack()}
          >
            {useIcon('BackArrow', 'inline-flex pb-2 h-7 fill-current mr-2')}
            Go Back
          </button>
        </div>
        <a
          className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg"
          href="https://support.firstvoices.com/servicedesk/customer/portal/1"
        >
          Report Problem
        </a>
      </div>
    </div>
  )
}
// PROPTYPES
const { node, number, oneOfType, string } = PropTypes
ErrorHandlerPresentation.propTypes = {
  status: oneOfType([string, number]),
  heading: string,
  content: oneOfType([string, node]),
}

export default ErrorHandlerPresentation
