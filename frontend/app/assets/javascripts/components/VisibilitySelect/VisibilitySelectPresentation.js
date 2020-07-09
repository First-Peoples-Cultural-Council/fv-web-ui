import React from 'react'

import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import LockIcon from '@material-ui/icons/Lock'
import GroupIcon from '@material-ui/icons/Group'
import PublicIcon from '@material-ui/icons/Public'
import { makeStyles } from '@material-ui/core/styles'
// FPCC
import '!style-loader!css-loader!./VisibilitySelect.css'

import PropTypes from 'prop-types'

/**
 * @summary VisibilitySelectPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 250,
  },
  margin: {
    margin: theme.spacing(1),
  },
}))

function VisibilitySelectPresentation({ handleChange, visibility }) {
  const classes = useStyles()
  return (
    <div>
      <InputLabel id="select-label">Who can see this?</InputLabel>
      <FormControl variant="outlined" className={classes.formControl}>
        <Select labelId="select-outlined-label" id="select" value={visibility} onChange={handleChange}>
          <MenuItem value={'team'}>
            <LockIcon className={classes.margin} />
            Language Team
          </MenuItem>
          <MenuItem value={'members'}>
            <GroupIcon className={classes.margin} />
            Members
          </MenuItem>
          <MenuItem value={'public'}>
            <PublicIcon className={classes.margin} />
            Public
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
}

VisibilitySelectPresentation.defaultProps = {
  handleChange: () => {},
  visibility: '',
}

export default VisibilitySelectPresentation
