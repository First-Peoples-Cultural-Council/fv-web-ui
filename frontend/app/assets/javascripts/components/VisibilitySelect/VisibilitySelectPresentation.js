import React from 'react'
import PropTypes from 'prop-types'

import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import LockIcon from '@material-ui/icons/Lock'
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
 *
 * @returns {node} jsx markup
 */

function VisibilitySelectPresentation({handleChange, selectNameAndId, visibility}) {
  const classes = VisibilitySelectStyles()
  const selectLabel = selectNameAndId
  return (
      <div>
        <div id="select-label" className={classes.Select}>
          Who can see this?
        </div>
        <FormControl variant="outlined">
          <Select labelId="select-outlined-label" id={selectLabel}
                  value={visibility} onChange={handleChange}
                  inputProps={{name: selectLabel}}>
            <MenuItem value={'team'}>
              <LockIcon className={classes.icon}/>
              Language Team
            </MenuItem>
            <MenuItem value={'members'}>
              <GroupIcon className={classes.icon}/>
              Members
            </MenuItem>
            <MenuItem value={'public'}>
              <PublicIcon className={classes.icon}/>
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
  handleChange: func,
  visibility: string,
  selectNameAndId: string,
}

VisibilitySelectPresentation.defaultProps = {
  handleChange: () => {},
  visibility: '',
  selectNameAndId: 'select'
}

export default VisibilitySelectPresentation
