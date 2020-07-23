import React from 'react'
// import PropTypes from 'prop-types'
import AdminMenuPresentation from 'components/AdminMenu/AdminMenuPresentation'
import AdminMenuData from 'components/AdminMenu/AdminMenuData'

/**
 * @summary AdminMenuContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function AdminMenuContainer() {
  return (
    <AdminMenuData>
      {({ handleItemClick, tooltipTitle }) => {
        return <AdminMenuPresentation handleItemClick={handleItemClick} tooltipTitle={tooltipTitle} />
      }}
    </AdminMenuData>
  )
}
// PROPTYPES
// const { string } = PropTypes
AdminMenuContainer.propTypes = {
  //   something: string,
}

export default AdminMenuContainer
