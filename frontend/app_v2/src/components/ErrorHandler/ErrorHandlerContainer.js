import React from 'react'
// import PropTypes from 'prop-types'
import ErrorHandlerPresentation from 'components/ErrorHandler/ErrorHandlerPresentation'
import ErrorHandlerData from 'components/ErrorHandler/ErrorHandlerData'

/**
 * @summary ErrorHandlerContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ErrorHandlerContainer({ children }) {
  const { errorStatusCode } = ErrorHandlerData()

  switch (errorStatusCode) {
    case 404:
      return <ErrorHandlerPresentation status={errorStatusCode} />
    case 403:
      return <ErrorHandlerPresentation status={errorStatusCode} />
    default:
      return children
  }
}
// PROPTYPES
// const { string } = PropTypes
ErrorHandlerContainer.propTypes = {
  //   something: string,
}

export default ErrorHandlerContainer
