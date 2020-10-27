import React, { useState } from 'react'
import PropTypes from 'prop-types'
// MUI
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import NavigationExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Tooltip from '@material-ui/core/Tooltip'

// FPCC
import FVLabel from 'components/FVLabel'

import '!style-loader!css-loader!./AdminMenu.css'
/**
 * @summary AdminMenuPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */

function AdminMenuPresentation({ handleItemClick, tooltipTitle }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const menuItems = [
    <MenuItem
      key="reports"
      onClick={() => {
        handleItemClick('/reports')
      }}
    >
      <FVLabel transKey="reports" defaultStr="Reports" transform="first" />
    </MenuItem>,
    <MenuItem
      key="media"
      onClick={() => {
        handleItemClick('/media')
      }}
    >
      <FVLabel transKey="views.pages.explore.dialect.media_browser" defaultStr="Media Browser" transform="words" />
    </MenuItem>,
    <MenuItem
      key="phrasebooks"
      onClick={() => {
        handleItemClick('/phrasebooks')
      }}
    >
      <FVLabel transKey="views.pages.explore.dialect.nav_phrase_books" defaultStr="Phrase books" transform="words" />
    </MenuItem>,
    <MenuItem
      key="categories"
      onClick={() => {
        handleItemClick('/categories')
      }}
    >
      <FVLabel transKey="views.pages.explore.dialect.nav_categories" defaultStr="Categories" transform="words" />
    </MenuItem>,
    // <MenuItem key="contributors" onClick={() => { handleItemClick('/contributors') }}>
    //   <FVLabel transKey="views.pages.explore.dialect.nav_contributors" defaultStr="Contributors" transform="words" />
    // </MenuItem>,
    // <MenuItem key="recorders" onClick={() => { handleItemClick('/recorders') }}>
    //   <FVLabel transKey="views.pages.explore.dialect.nav_recorders" defaultStr="Recorders" transform="words" />
    // </MenuItem>,
    // <MenuItem key="immersionPortal" onClick={() => { handleItemClick('/immersion') }}>
    //   <FVLabel transKey="views.pages.explore.dialect.immersion" defaultStr="Immersion Portal" transform="words" />
    // </MenuItem>,
  ]
  return (
    <div className="AdminMenu">
      <Tooltip title={tooltipTitle} placement="top">
        <IconButton
          onClick={(event) => {
            setAnchorEl(event.currentTarget)
          }}
        >
          {' '}
          <NavigationExpandMoreIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={anchorEl ? true : false}
        onClose={() => {
          setAnchorEl(null)
        }}
      >
        {menuItems}
      </Menu>
    </div>
  )
}
// PROPTYPES
const { func, string } = PropTypes
AdminMenuPresentation.propTypes = {
  handleItemClick: func,
  tooltipTitle: string,
}

export default AdminMenuPresentation
