import React from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'
import PromiseWrapper from 'components/PromiseWrapper'
import FVButton from 'components/FVButton'
import FVLabel from 'components/FVLabel'

import './Membership.css'

/**
 * @summary MembershipPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function MembershipPresentation({
  computeEntities,
  currentRequest,
  groupSelected,
  handleDialogOk,
  isDialogOpen,
  handleDialogClose,
  serverErrorMessage,
  joinRequests,
  onApproveClick,
  onIgnoreClick,
  onGroupSelectChange,
}) {
  const getInterest = (role) => {
    const roleLabel = selectn(
      'text',
      ProviderHelpers.userRegistrationRoles.find((rolesVal) => rolesVal.value == role)
    )
    if (roleLabel && roleLabel != 'undefined') return roleLabel.replace('I am', ' ')
    return null
  }

  return (
    <PromiseWrapper renderOnError computeEntities={computeEntities}>
      <div className="Membership__header">
        <h1>Membership Requests</h1>
        <p>
          The following users have requested to join your language site.
          <br />
          Click the &quot;Add to Group&quot; button to make them a Member of your site or to assign them a role on your
          Language Team.
        </p>
        <p>
          Not sure which group to select? Click{' '}
          <a href="https://wiki.firstvoices.com/display/FIR1/Roles+on+FirstVoices" target="new">
            here
          </a>{' '}
          to learn more about the different roles on FirstVoices.
        </p>
        {serverErrorMessage}
      </div>
      {joinRequests.length === 0 ? (
        <div className="Membership--empty">There are currently no membership requests.</div>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead border="1">
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>
                  <FVLabel transKey="comments" defaultStr="Comments" transform="words" />
                </TableCell>
                <TableCell>Date requested</TableCell>
                <TableCell>
                  <FVLabel transKey="actions" defaultStr="Actions" transform="words" />
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {joinRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <p>
                      <strong>
                        <FVLabel transKey="name" defaultStr="Name" />:
                      </strong>{' '}
                      {request.requestUserFirstName} {request.requestUserLastName}
                    </p>
                    <p>
                      <strong>
                        <FVLabel transKey="email" defaultStr="Email" />:
                      </strong>{' '}
                      {request.requestUsername}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p>
                      <strong>Community member:</strong> {request.communityMember ? 'Yes' : 'No'}
                    </p>
                    <p>
                      <strong>Language Team member:</strong> {request.languageTeamMember ? 'Yes' : 'No'}
                    </p>
                    <p>
                      <strong>Reason for interest:</strong>
                      {getInterest(request.interestReason)}
                    </p>
                    <p>
                      <strong>Message from user: </strong>
                    </p>
                    <p>{request.comment}</p>
                  </TableCell>
                  <TableCell>{StringHelpers.formatUTCDateString(request.requestDate)}</TableCell>
                  <TableCell>
                    <div className="Membership__btngrp">
                      <div className="Membership__button">
                        <FVButton variant="contained" color="primary" onClick={() => onApproveClick(request)}>
                          <FVLabel transKey="add_to_group" defaultStr="Add to Group" />
                        </FVButton>
                      </div>
                      <div className="Membership__button">
                        <FVButton variant="contained" color="secondary" onClick={() => onIgnoreClick(request.id)}>
                          <FVLabel transKey="ignore" defaultStr="Ignore" />
                        </FVButton>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog fullWidth maxWidth="md" open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          Add {currentRequest.requestUserFirstName} {currentRequest.requestUserLastName} as a:{' '}
        </DialogTitle>
        <DialogContent>
          <FormControl variant="outlined" size="small" className="Membership--dashboardDetail">
            <Select
              className="Membership__select"
              labelId="select-outlined-label"
              value={groupSelected}
              onChange={onGroupSelectChange}
            >
              <MenuItem value={'members'}>
                <span>Member</span>
              </MenuItem>
              <MenuItem value={'recorders'}>
                <span>Recorder</span>
              </MenuItem>
              <MenuItem value={'recorders_with_approval'}>
                <span>Recorder with approval</span>
              </MenuItem>
              <MenuItem value={'language_administrators'}>
                <span>Language Administrator</span>
              </MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <FVButton variant="contained" color="secondary" onClick={handleDialogClose}>
            <FVLabel transKey="cancel" defaultStr="Cancel" />
          </FVButton>
          <FVButton variant="contained" color="primary" onClick={() => handleDialogOk()}>
            <FVLabel transKey="submit" defaultStr="Submit" />
          </FVButton>
        </DialogActions>
      </Dialog>
    </PromiseWrapper>
  )
}
// PROPTYPES
const { array, bool, func, object, string } = PropTypes
MembershipPresentation.propTypes = {
  computeEntities: object,
  currentRequest: object,
  groupSelected: string,
  handleDialogOk: func,
  isDialogOpen: bool,
  handleDialogClose: func,
  serverErrorMessage: string,
  joinRequests: array,
  onApproveClick: func,
  onIgnoreClick: func,
  onGroupSelectChange: func,
}

export default MembershipPresentation
