import React, { Suspense } from 'react'
import PropTypes from 'prop-types'

function Suspender({ children }) {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
}
// PROPTYPES
const { node } = PropTypes
Suspender.propTypes = {
  children: node,
}
export default Suspender
