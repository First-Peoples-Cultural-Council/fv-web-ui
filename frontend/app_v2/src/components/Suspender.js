import React, { Suspense } from 'react'
import PropTypes from 'prop-types'

// NOTE: This file is purely for DRY purposes.
// If we were to directly add <Suspense/> tags
// throughout the codebase we'd have to edit many locations
// if/when we change the component in the `fallback` prop
function Suspender({ children }) {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
}
// PROPTYPES
const { node } = PropTypes
Suspender.propTypes = {
  children: node,
}
export default Suspender
