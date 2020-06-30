import React from 'react'
// import PropTypes from 'prop-types'
import TEMPLATEPresentation from './TEMPLATEPresentation'
import TEMPLATEData from './TEMPLATEData'

/**
 * @summary TEMPLATEContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function TEMPLATEContainer() {
  return (
    <TEMPLATEData>
      {(TEMPLATEDataOutput) => {
        // TODO FW-TEMPLATE
        // eslint-disable-next-line
        console.log('TEMPLATEDataOutput', TEMPLATEDataOutput)
        return <TEMPLATEPresentation />
      }}
    </TEMPLATEData>
  )
}
// PROPTYPES
// const { string } = PropTypes
TEMPLATEContainer.propTypes = {
  //   something: string,
}

export default TEMPLATEContainer
