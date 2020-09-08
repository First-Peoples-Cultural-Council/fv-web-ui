import React from 'react'
import PropTypes from 'prop-types'

import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import GroupIcon from '@material-ui/icons/Group'
import PublicIcon from '@material-ui/icons/Public'
// FPCC
import '!style-loader!css-loader!./VisibilitySelect.css'

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
  classes,
  docVisibility,
  handleVisibilityChange,
  hideLabel,
  publicDialect,
  selectNameAndId,
}) {
  return (
    <div className={`VisibilitySelect ${classes.root}`}>
      {!hideLabel && (
        <div id="select-label" className="VisibilitySelect__label">
          Who can see this?
        </div>
      )}
      <FormControl variant="outlined" size="small">
        <Select
          className="VisibilitySelect__select"
          labelId="select-outlined-label"
          id={selectNameAndId}
          value={docVisibility}
          onChange={handleVisibilityChange}
          inputProps={{ name: selectNameAndId }}
        >
          <MenuItem value={'team'}>
            <span className="VisibilitySelect__menuItemGroup">
              <VisibilityOffIcon className="VisibilitySelect__icon" />
              Language Team
            </span>
          </MenuItem>
          <MenuItem value={'members'}>
            <span className="VisibilitySelect__menuItemGroup">
              <GroupIcon className="VisibilitySelect__icon" />
              Members
            </span>
          </MenuItem>
          {publicDialect ? (
            <MenuItem value={'public'}>
              <span className="VisibilitySelect__menuItemGroup">
                <PublicIcon className="VisibilitySelect__icon" />
                Everyone
              </span>
            </MenuItem>
          ) : null}
        </Select>
      </FormControl>
    </div>
  )
}
// PROPTYPES
const { func, string, object, bool } = PropTypes
VisibilitySelectPresentation.propTypes = {
  classes: object,
  docVisibility: string,
  handleVisibilityChange: func,
  hideLabel: bool,
  publicDialect: bool,
  selectNameAndId: string,
}

VisibilitySelectPresentation.defaultProps = {
  docVisibility: '',
  handleVisibilityChange: () => {},
  hideLabel: false,
  publicDialect: false,
  selectNameAndId: 'select',
  classes: {
    root: '',
  },
}

export default VisibilitySelectPresentation
