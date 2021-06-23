import React from 'react'
import PropTypes from 'prop-types'
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
function ErrorHandlerContainer({ children, error }) {
  const { errorStatusCode } = ErrorHandlerData()
  let errorStatus = null

  if (error && error?.status) {
    errorStatus = error?.status
  }
  if (errorStatusCode) {
    errorStatus = errorStatusCode
  }

  switch (true) {
    case errorStatus === 401:
    case errorStatus === 403:
      return (
        <ErrorHandlerPresentation
          status={errorStatus}
          heading={'Unauthorized'}
          content={'You do not have permission to view this page.'}
        />
      )
    case errorStatus === 404:
      return (
        <ErrorHandlerPresentation
          status={errorStatus}
          heading={'Not Found'}
          content="Sorry, we couldn't find that page."
        />
      )
    // Catch any other 4** errors
    case Math.floor(errorStatusCode / 100) === 4:
      return (
        <ErrorHandlerPresentation
          status={errorStatusCode}
          heading={'Error'}
          content={'Sorry, please try again. If this issue persists please contact our team.'}
        />
      )
    // Catch any other 5** errors
    case Math.floor(errorStatus / 100) === 5:
      return (
        <ErrorHandlerPresentation
          status={errorStatus}
          heading={'Oops, something went wrong.'}
          content={'Please try again. If this issue persists please contact our team.'}
        />
      )
    default:
      return children
  }
}
// PROPTYPES
const { node } = PropTypes
ErrorHandlerContainer.propTypes = {
  children: node,
}

export default ErrorHandlerContainer
