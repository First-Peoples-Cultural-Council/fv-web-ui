import React from 'react'
// import PropTypes from 'prop-types'
import DashboardDetailSelectedItemPresentation from './DashboardDetailSelectedItemPresentation'
import DashboardDetailSelectedItemData from './DashboardDetailSelectedItemData'

/**
 * @summary DashboardDetailSelectedItemContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function DashboardDetailSelectedItemContainer() {
  return (
    <DashboardDetailSelectedItemData>
      {() => {
        return <DashboardDetailSelectedItemPresentation />
      }}
    </DashboardDetailSelectedItemData>
  )
}
// PROPTYPES
// const { node } = PropTypes
// DashboardDetailSelectedItemContainer.propTypes = {
//   closeButton: node,
// }

export default DashboardDetailSelectedItemContainer
