import React from 'react'

import MembershipPresentation from 'components/Membership/MembershipPresentation'
import MembershipData from 'components/Membership/MembershipData'
import classNames from 'classnames'

/**
 * @summary MembershipContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function MembershipContainer() {
  return (
    <MembershipData>
      {({
        actionResponse,
        computeEntities,
        currentRequest,
        isAdmin,
        groupSelected,
        handleDialogOk,
        isDialogOpen,
        handleDialogClose,
        handleSnackbarClose,
        isSnackbarOpen,
        joinRequests,
        onApproveClick,
        onIgnoreClick,
        onGroupSelectChange,
      }) => {
        return isAdmin ? (
          <MembershipPresentation
            actionResponse={actionResponse}
            computeEntities={computeEntities}
            currentRequest={currentRequest}
            groupSelected={groupSelected}
            handleDialogOk={handleDialogOk}
            isDialogOpen={isDialogOpen}
            handleDialogClose={handleDialogClose}
            handleSnackbarClose={handleSnackbarClose}
            isSnackbarOpen={isSnackbarOpen}
            joinRequests={joinRequests}
            onApproveClick={onApproveClick}
            onIgnoreClick={onIgnoreClick}
            onGroupSelectChange={onGroupSelectChange}
          />
        ) : (
          <div className={classNames('alert', 'alert-warning')} role="alert">
            Dashboards are currently only available for language administrators.
          </div>
        )
      }}
    </MembershipData>
  )
}
// PROPTYPES
// const { string } = PropTypes
MembershipContainer.propTypes = {
  //   something: string,
}

export default MembershipContainer
