import React from 'react'
import AdminMenuPresentation from 'components/AdminMenu/AdminMenuPresentation'
import AdminMenuData from 'components/AdminMenu/AdminMenuData'

/**
 * @summary AdminMenuContainer
 * @version 1.0.1
 * @component
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

export default AdminMenuContainer
