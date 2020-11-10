import React from 'react'
import PropTypes from 'prop-types'

import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import GroupIcon from '@material-ui/icons/Group'
import PublicIcon from '@material-ui/icons/Public'
import StringHelpers from 'common/StringHelpers'
import Typography from '@material-ui/core/Typography'

// FPCC
import '!style-loader!css-loader!./VisibilitySelect.css'

/**
 * @summary VisibilitySelectPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @param {object} props.classes
 *
 * @param {string} props.dialectName If provided, enhances the select > option text
 * @param {string} props.docVisibility Sets value of select list
 * @param {function} props.handleVisibilityChange A function to handle the onChange of the select component
 * @param {boolean} props.hideLabel Toggle to display text near select list
 * @param {boolean} props.publicDialect Toggles the public option in the select list. TODO: rename to `isPublicDialect`
 * @param {string} props.selectLabelText Override the select label text
 * @param {string} props.selectNameAndId For Mat-UI: associates styled list with html select & inputs
 *
 * @returns {node} jsx markup
 */

function VisibilitySelectPresentation({
  classes,
  dialectName,
  docVisibility,
  handleVisibilityChange,
  hideLabel,
  publicDialect,
  selectLabelText,
  selectNameAndId,
}) {
  return (
    <div className={`VisibilitySelect ${classes.root}`}>
      {!hideLabel && (
        <Typography id="select-label" className="VisibilitySelect__label" variant="body1" component="div">
          {selectLabelText}
        </Typography>
      )}
      <FormControl variant="outlined" size="small" className={classes.formControl}>
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
              {StringHelpers.visibilityText({ visibility: 'team', dialectName })}
            </span>
          </MenuItem>
          <MenuItem value={'members'}>
            <span className="VisibilitySelect__menuItemGroup">
              <GroupIcon className="VisibilitySelect__icon" />
              {StringHelpers.visibilityText({ visibility: 'members', dialectName })}
            </span>
          </MenuItem>
          {publicDialect ? (
            <MenuItem value={'public'}>
              <span className="VisibilitySelect__menuItemGroup">
                <PublicIcon className="VisibilitySelect__icon" />
                {StringHelpers.visibilityText({ visibility: 'public', dialectName })}
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
  dialectName: string,
  docVisibility: string,
  handleVisibilityChange: func,
  hideLabel: bool,
  publicDialect: bool,
  selectLabelText: string,
  selectNameAndId: string,
}

VisibilitySelectPresentation.defaultProps = {
  classes: {
    root: '',
  },
  docVisibility: '',
  handleVisibilityChange: () => {},
  hideLabel: false,
  publicDialect: false,
  selectLabelText: 'Change to:',
  selectNameAndId: 'select',
}

export default VisibilitySelectPresentation
