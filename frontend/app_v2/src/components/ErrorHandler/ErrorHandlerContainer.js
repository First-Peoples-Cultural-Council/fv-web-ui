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
function ErrorHandlerContainer({ children }) {
  const { errorStatusCode } = ErrorHandlerData()

  switch (true) {
    case errorStatusCode === 401:
    case errorStatusCode === 403:
      return (
        <ErrorHandlerPresentation
          status={errorStatusCode}
          heading={'Unauthorized'}
          content={'You do not have permission to view this page.'}
        />
      )
    case errorStatusCode === 404:
      return (
        <ErrorHandlerPresentation
          status={errorStatusCode}
          heading={'Not Found'}
          content="The page you're looking for isn't available."
        />
      )
    case Math.floor(errorStatusCode / 100) === 4:
      return <ErrorHandlerPresentation status={errorStatusCode} heading={'Error'} content={'Generic content'} />
    case Math.floor(errorStatusCode / 100) === 5:
      return (
        <ErrorHandlerPresentation
          status={errorStatusCode}
          heading={'Oops, something went wrong.'}
          content={'Please report this to our team.'}
        />
      )
    default:
      return children
  }
}
// PROPTYPES
const { object } = PropTypes
ErrorHandlerContainer.propTypes = {
  children: object,
}

export default ErrorHandlerContainer
