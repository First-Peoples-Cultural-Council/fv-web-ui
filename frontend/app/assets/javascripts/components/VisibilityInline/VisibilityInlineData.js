import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
//FPCC
import useLogin from 'DataSource/useLogin'
import useRoute from 'DataSource/useRoute'
import useVisibility from 'DataSource/useVisibility'
import ProviderHelpers from 'common/ProviderHelpers'
import { WORKSPACES } from 'common/Constants'

/**
 * @summary VisibilityInlineData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function VisibilityInlineData({ children, docId, docState }) {
  const { computeLogin } = useLogin()
  const { routeParams } = useRoute()
  const { updateVisibilityToTeam, updateVisibilityToMembers, updateVisibilityToPublic } = useVisibility()

  const workspaces = routeParams.area === WORKSPACES
  const dialectName = routeParams.dialect_name

  // Check to see if user is an Admin or Recorder with approval
  const writePrivileges = ProviderHelpers.isRecorderWithApproval(computeLogin) || ProviderHelpers.isAdmin(computeLogin)

  // Set local state for visibility
  const [docVisibility, setDocVisibility] = useState('')

  useEffect(() => {
    setDocVisibility(convertStateToVisibility(docState))
  }, [])

  // Handle change from select menu
  const handleVisibilityChange = (event) => {
    const newVisibility = event.target.value
    // Set visibility for local state
    setDocVisibility(newVisibility)
    // Send request to the server to set visibility on the document
    switch (newVisibility) {
      case 'team':
        return updateVisibilityToTeam(docId)
      case 'members':
        return updateVisibilityToMembers(docId)
      case 'public':
        return updateVisibilityToPublic(docId)
      default:
        return null
    }
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

  return children({
    docVisibility,
    dialectName,
    handleVisibilityChange,
    workspaces,
    writePrivileges,
  })
}
// PROPTYPES
const { func, string } = PropTypes
VisibilityInlineData.propTypes = {
  children: func,
  docId: string,
  docState: string,
}

export default VisibilityInlineData
