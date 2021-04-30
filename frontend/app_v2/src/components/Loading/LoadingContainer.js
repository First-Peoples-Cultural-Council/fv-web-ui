import React from 'react'
import PropTypes from 'prop-types'
import LoadingPresentation from 'components/Loading/LoadingPresentation'

/**
 * @summary LoadingContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function LoadingContainer({ children, isLoading }) {
  return isLoading ? <LoadingPresentation /> : children
}
// PROPTYPES
const { bool, object } = PropTypes
LoadingContainer.propTypes = {
  children: object,
  isLoading: bool,
}

export default LoadingContainer
