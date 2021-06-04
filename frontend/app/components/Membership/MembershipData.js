import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Immutable from 'immutable'
import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'

import useLogin from 'dataSources/useLogin'
import useUser from 'dataSources/useUser'

/**
 * @summary MembershipData
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function MembershipData({ children }) {
  const { approveJoinRequest, ignoreJoinRequest, getJoinRequests, computeJoinRequests } = useUser()
  const { computeLogin } = useLogin()
  const isAdmin = ProviderHelpers.isAdmin(computeLogin)

  const siteId = new URLSearchParams(window.location.search).get('siteId')
    ? new URLSearchParams(window.location.search).get('siteId')
    : null

  // Set up Dialog and Snackbar state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [groupSelected, setGroupSelected] = useState('members')
  const [currentRequest, setCurrentRequest] = useState('members')

  useEffect(() => {
    if (siteId) {
      getJoinRequests({ siteId: siteId })
    }
    if (siteId === null) {
      window.location.href = '/dashboard'
    }
  }, [])

  const onApproveClick = (request) => {
    setIsDialogOpen(true)
    setCurrentRequest(request)
  }
  const onIgnoreClick = (id) => {
    ignoreJoinRequest({ siteId: siteId, requestId: id, messageToUser: '' })
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setGroupSelected('members')
  }

  const handleDialogOk = () => {
    setIsDialogOpen(false)
    approveJoinRequest({ siteId: siteId, requestId: currentRequest.id, group: groupSelected, messageToUser: '' })
  }

  const onGroupSelectChange = (event) => {
    setGroupSelected(event.target.value)
  }

  const joinRequests = selectn('message.joinRequests', computeJoinRequests)
    ? selectn('message.joinRequests', computeJoinRequests)
    : []

  const computeEntities = Immutable.fromJS([
    {
      id: siteId,
      entity: computeJoinRequests,
    },
  ])

  return children({
    computeEntities,
    currentRequest,
    isAdmin,
    groupSelected,
    handleDialogOk,
    isDialogOpen,
    handleDialogClose,
    joinRequests,
    onApproveClick,
    onGroupSelectChange,
    onIgnoreClick,
  })
}
// PROPTYPES
const { func } = PropTypes
MembershipData.propTypes = {
  children: func,
}

export default MembershipData
