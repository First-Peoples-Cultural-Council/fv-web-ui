import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
//FPCC
import useLogin from 'DataSource/useLogin'
import useRoute from 'DataSource/useRoute'
import useVisibility from 'DataSource/useVisibility'
import ProviderHelpers from 'common/ProviderHelpers'
import { WORKSPACES } from 'common/Constants'

/**
 * @summary VisibilityMinimalData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function VisibilityMinimalData({ children, docId, docState }) {
  const { computeLogin } = useLogin()
  const { routeParams } = useRoute()
  const { updateVisibilityToTeam, updateVisibilityToMembers, updateVisibilityToPublic } = useVisibility()

  const workspaces = routeParams.area === WORKSPACES
  const dialectName = routeParams.dialect_name

  // Check to see if user is an Admin or Recorder with approval
  const writePrivileges = ProviderHelpers.isRecorderWithApproval(computeLogin) || ProviderHelpers.isAdmin(computeLogin)

  // Set local state for visibility
  const [docVisibility, setDocVisibility] = useState('')
  const [dialogContent, setDialogContent] = useState('')

  // Set up Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    setDocVisibility(convertStateToVisibility(docState))
  }, [])

  // triggered by OnChange from VisibilitySelect
  const handleVisibilityChange = (event) => {
    const newVisibility = event.target.value
    // Set visibility in local state
    setDocVisibility(newVisibility)
    // Open confirmation dialog and set content (setting the content separately from the docVisibility prevents the content from changing before the dialog closes)
    setDialogContent(newVisibility)
    setIsDialogOpen(true)
  }

  const handleDialogCancel = () => {
    setIsDialogOpen(false)
    setDocVisibility(convertStateToVisibility(docState))
  }

  const handleDialogOk = () => {
    setIsDialogOpen(false)
    updateVisibility(docVisibility)
  }

  const updateVisibility = (newVisibility) => {
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
    dialogContent,
    handleVisibilityChange,
    handleDialogCancel,
    handleDialogOk,
    isDialogOpen,
    workspaces,
    writePrivileges,
  })
}
// PROPTYPES
const { func, string } = PropTypes
VisibilityMinimalData.propTypes = {
  children: func,
  docId: string,
  docState: string,
}

export default VisibilityMinimalData
