import React from 'react'
import PropTypes from 'prop-types'
import { Link, useHistory } from 'react-router-dom'

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
    <div className="min-w-screen min-h-screen bg-gradient-to-r from-fv-turquoise to-fv-blue-light flex items-center p-5 lg:p-20 overflow-hidden relative">
      <div className="w-full flex-1 min-h-full min-w-full rounded-3xl bg-white shadow-xl p-10 lg:p-20 text-gray-800 relative items-center text-center">
        <h1 className="font-black text-3xl lg:text-5xl text-fv-charcoal mb-12">Oops! We&apos;ve found a problem...</h1>
        <div className="mb-12 text-gray-600 font-light">
          <h1 className="font-black uppercase text-3xl lg:text-5xl text-fv-turquoise mb-5">
            {status} {heading}
          </h1>
          {content}
        </div>
        <div className="mb-2 md:mb-5">
          <button
            className="text-lg font-light outline-none focus:outline-none transform transition-all hover:scale-110 text-fv-turquoise hover:text-fv-turquoise-dark"
            onClick={() => history.goBack()}
          >
            {useIcon('BackArrow', 'inline-flex pb-2 h-7 fill-current mr-2')}
            Go Back
          </button>
        </div>
        <Link
          className="bg-gradient-to-r from-fv-orange to-fv-red hover:from-fv-red hover:to-fv-red text-white font-semibold px-6 py-3 rounded-md mr-6"
          to="/"
        >
          Home
        </Link>
        <a
          className="bg-gradient-to-r from-fv-blue-light to-fv-turquoise hover:from-fv-blue-light hover:to-fv-blue-light text-white font-semibold px-6 py-3 rounded-md"
          href="https://support.firstvoices.com/servicedesk/customer/portal/1"
        >
          Support
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
