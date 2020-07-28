import React from 'react'
import PropTypes from 'prop-types'
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
function DashboardDetailSelectedItemContainer({ id }) {
  return (
    <DashboardDetailSelectedItemData id={id}>
      {() => {
        return <DashboardDetailSelectedItemPresentation id={id} />
      }}
    </DashboardDetailSelectedItemData>
  )
}
// PROPTYPES
const { string } = PropTypes
DashboardDetailSelectedItemContainer.propTypes = {
  id: string,
}

export default DashboardDetailSelectedItemContainer
