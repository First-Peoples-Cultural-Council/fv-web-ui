import React from 'react'
// import PropTypes from 'prop-types'
import TEMPLATEPresentation from 'components/TEMPLATE/TEMPLATEPresentation'
import TEMPLATEData from 'components/TEMPLATE/TEMPLATEData'

/**
 * @summary TEMPLATEContainer
 * @version 1.0.0
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function TEMPLATEContainer() {
  const { exampleOutput } = TEMPLATEData({ exampleInput: 'passedInToData' })
  return <TEMPLATEPresentation exampleProp={exampleOutput} />
}
// PROPTYPES
// const { string } = PropTypes
TEMPLATEContainer.propTypes = {
  //   something: string,
}

export default TEMPLATEContainer
