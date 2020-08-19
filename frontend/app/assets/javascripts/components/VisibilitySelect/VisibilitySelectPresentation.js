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

function VisibilitySelectPresentation({
  handleVisibilityChange,
  docVisibility,
  hideLabel,
  publicDialect,
  selectNameAndId,
}) {
  const classes = VisibilitySelectStyles()

  const label = hideLabel ? null : (
    <div id="select-label" className={classes.selectLabel}>
      Who can see this?
    </div>
  )

  return (
    <div className={classes.selectBase}>
      {label}
      <FormControl variant="outlined" size="small">
        <Select
          labelId="select-outlined-label"
          id={selectNameAndId}
          value={docVisibility}
          onChange={handleVisibilityChange}
          inputProps={{ name: selectNameAndId }}
        >
          <MenuItem value={'team'}>
            <VisibilityOffIcon className={classes.selectIcon} />
            Language Team
          </MenuItem>
          <MenuItem value={'members'}>
            <GroupIcon className={classes.selectIcon} />
            Members
          </MenuItem>
          {publicDialect ? (
            <MenuItem value={'public'}>
              <PublicIcon className={classes.selectIcon} />
              Everyone
            </MenuItem>
          ) : null}
        </Select>
      </FormControl>
    </div>
  )
}
// PROPTYPES
const { func, string, bool } = PropTypes
VisibilitySelectPresentation.propTypes = {
  handleVisibilityChange: func,
  docVisibility: string,
  hideLabel: bool,
  publicDialect: bool,
  selectNameAndId: string,
}

VisibilitySelectPresentation.defaultProps = {
  handleVisibilityChange: () => {},
  docVisibility: '',
  hideLabel: false,
  publicDialect: false,
  selectNameAndId: 'select',
}

export default VisibilitySelectPresentation
