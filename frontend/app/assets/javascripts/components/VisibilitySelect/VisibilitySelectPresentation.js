import React, { useState, useEffect } from 'react'

import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import LockIcon from '@material-ui/icons/Lock'
import GroupIcon from '@material-ui/icons/Group'
import PublicIcon from '@material-ui/icons/Public'
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

function VisibilitySelectPresentation({ docState, docId, handleVisibilityChange }) {
  const [visibility, setVisibility] = useState('')

  useEffect(() => {
    setVisibility(convertStateToVisibility(docState))
  }, [])

  const handleChange = (event) => {
    const newVisibility = event.target.value
    setVisibility(newVisibility)
    handleVisibilityChange(newVisibility, docId)
  }

  function convertStateToVisibility(state) {
    switch (state) {
      case 'New':
        return 'team'
      case 'Disabled':
        return 'team'
      case 'Enabled':
        return 'members'
      case 'Published':
        return 'public'
      default:
        return ''
    }
  }

  return (
    <div>
      <div id="select-label" className="Select">
        Who can see this?
      </div>
      <FormControl variant="outlined">
        <Select labelId="select-outlined-label" id="select" value={visibility} onChange={handleChange}>
          <MenuItem value={'team'}>
            <LockIcon />
            Language Team
          </MenuItem>
          <MenuItem value={'members'}>
            <GroupIcon />
            Members
          </MenuItem>
          <MenuItem value={'public'}>
            <PublicIcon />
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
  docId: string.isRequired,
  docState: string.isRequired,
  handleVisibilityChange: func,
}

VisibilitySelectPresentation.defaultProps = {
  docId: '',
  docState: '',
  handleVisibilityChange: () => {},
}

export default VisibilitySelectPresentation
