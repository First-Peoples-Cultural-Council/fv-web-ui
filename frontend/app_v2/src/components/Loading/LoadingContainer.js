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
const { bool, node } = PropTypes
LoadingContainer.propTypes = {
  children: node,
  isLoading: bool,
}

export default LoadingContainer
