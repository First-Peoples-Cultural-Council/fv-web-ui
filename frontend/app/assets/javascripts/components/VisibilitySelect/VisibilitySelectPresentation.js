import React from 'react'
import PropTypes from 'prop-types'

import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import GroupIcon from '@material-ui/icons/Group'
import PublicIcon from '@material-ui/icons/Public'
// FPCC
import { VisibilitySelectStyles } from './VisibilitySelectStyles'

/**
 * @summary VisibilitySelectPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {string} docVisibility A string with the value of 'teams', 'members', or, 'public
 * @param {function} handleVisibilityChange A function to handle the onChange of the select component
 *
 * @returns {node} jsx markup
 */

function VisibilitySelectPresentation({ handleVisibilityChange, docVisibility }) {
  const classes = VisibilitySelectStyles()
  return (
    <div className={classes.selectBase}>
      <div id="select-label" className={classes.selectLabel}>
        Who can see this?
      </div>
      <FormControl variant="outlined">
        <Select labelId="select-outlined-label" id="select" value={docVisibility} onChange={handleVisibilityChange}>
          <MenuItem value={'team'}>
            <VisibilityOffIcon className={classes.selectIcon} />
            Language Team
          </MenuItem>
          <MenuItem value={'members'}>
            <GroupIcon className={classes.selectIcon} />
            Members
          </MenuItem>
          <MenuItem value={'public'}>
            <PublicIcon className={classes.selectIcon} />
            Everyone
          </MenuItem>
        </Select>
      </FormControl>
    </div>
  )
}
// PROPTYPES
const { func, string } = PropTypes
VisibilitySelectPresentation.propTypes = {
  handleVisibilityChange: func,
  docVisibility: string,
}

VisibilitySelectPresentation.defaultProps = {
  handleVisibilityChange: () => {},
  docVisibility: '',
}

export default VisibilitySelectPresentation
