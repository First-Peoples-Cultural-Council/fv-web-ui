import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
//FPCC
// import useIntl from 'DataSource/useIntl'
import useLogin from 'DataSource/useLogin'
import useRoute from 'DataSource/useRoute'
import useVisibility from 'DataSource/useVisibility'
import ProviderHelpers from 'common/ProviderHelpers'
import { WORKSPACES } from 'common/Constants'

/**
 * @summary RequestReviewData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 * @param {string} docId UID of the document that is being viewed
 * @param {string} docState The nuxeo 'state' of the document: 'New', 'Enabled', 'Disabled', or 'Published'.
 *
 */
function RequestReviewData({ children, docId, docState, docType }) {
  //   const { intl } = useIntl()
  const { computeLogin } = useLogin()
  const { routeParams } = useRoute()
  const { updateVisibilityToTeam, updateVisibilityToMembers, updateVisibilityToPublic } = useVisibility()

  const workspaces = routeParams.area === WORKSPACES
  const dialectName = routeParams.dialect_name

  // Check to see if user is an Admin or Recorder with approval
  const writePrivileges = ProviderHelpers.isRecorderWithApproval(computeLogin) || ProviderHelpers.isAdmin(computeLogin)

  // Set local state for visibility
  const [docVisibility, setDocVisibility] = useState('')
  const [dialogContent] = useState('')
  const [docTypeName, setDocTypeName] = useState('')

  // Set up Dialog and Snackbar state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  useEffect(() => {
    setDocVisibility(convertStateToVisibility(docState))
    setDocTypeName(convertToFriendlyType(docType))
  }, [])

  const handleRequestReview = () => {
    setIsDialogOpen(true)
  }

  // triggered by OnChange from VisibilitySelect
  const handleVisibilityChange = (event) => {
    const newVisibility = event.target.value
    // Set visibility in local state
    setDocVisibility(newVisibility)
  }

  const handleDialogCancel = () => {
    setIsDialogOpen(false)
    setDocVisibility(convertStateToVisibility(docState))
  }

  const handleDialogOk = () => {
    setIsDialogOpen(false)
    sendRequest(docVisibility)
    setSnackbarOpen(true)
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarOpen(false)
  }

  //   const askToPublishToggleAction = () => {
  //     this.props.askToPublishAction(
  //       docId,
  //       {
  //         id: 'FVPublishLanguageAsset',
  //         start: 'true',
  //       },
  //       null,
  //       intl.trans(
  //         'views.hoc.view.request_to_publish_x_successfully_submitted',
  //         'Request to publish ' + docTypeName + ' successfully submitted!',
  //         'first',
  //         [docTypeName]
  //       ),
  //       null
  //     )
  //   }

  //   const askToUnpublishToggleAction = () => {
  //     this.props.askToUnpublishAction(
  //       docId,
  //       {
  //         id: 'FVUnpublishLanguageAsset',
  //         start: 'true',
  //       },
  //       null,
  //       intl.trans(
  //         'views.hoc.view.request_to_unpublish_x_successfully_submitted',
  //         'Request to unpublish ' + docTypeName + ' successfully submitted!',
  //         'first',
  //         [docTypeName]
  //       ),
  //       null
  //     )
  //   }

  //   const askToEnableAction = () => {
  //     this.props.askToEnableAction(
  //       docId,
  //       {
  //         id: 'FVEnableLanguageAsset',
  //         start: 'true',
  //       },
  //       null,
  //       intl.trans(
  //         'views.hoc.view.request_to_enable_x_successfully_submitted',
  //         'Request to enable ' + docTypeName + ' successfully submitted!',
  //         'first',
  //         [docTypeName]
  //       ),
  //       null
  //     )
  //   }

  //   const askToDisableAction = () => {
  //     this.props.askToDisableAction(
  //       docId,
  //       {
  //         id: 'FVDisableLanguageAsset',
  //         start: 'true',
  //       },
  //       null,
  //       intl.trans(
  //         'views.hoc.view.request_to_disable_x_successfully_submitted',
  //         'Request to disable ' + docTypeName + ' successfully submitted!',
  //         'first',
  //         [docTypeName]
  //       ),
  //       null
  //     )
  //   }

  const sendRequest = (type) => {
    // Send request to the server to set visibility on the document
    switch (type) {
      case 'FVWord':
        return updateVisibilityToTeam(docId)
      case 'FVPhrase':
        return updateVisibilityToMembers(docId)
      case 'FVBook':
        return updateVisibilityToPublic(docId)
      case 'FVCharacter':
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

  function convertToFriendlyType(type) {
    switch (type) {
      case 'FVWord':
        return 'word'
      case 'FVPhrase':
        return 'phrase'
      case 'FVBook':
        return 'book'
      case 'FVCharacter':
        return 'character'
      default:
        return 'entry'
    }
  }

  return children({
    dialectName,
    docVisibility,
    docTypeName,
    handleRequestReview,
    workspaces,
    writePrivileges,
    // Dialog
    dialogContent,
    isDialogOpen,
    handleDialogCancel,
    handleDialogOk,
    // Snackbar
    handleSnackbarClose,
    snackbarOpen,
    // VisibilitySelect
    handleVisibilityChange,
  })
}
// PROPTYPES
const { func, string } = PropTypes
RequestReviewData.propTypes = {
  children: func,
  docId: string,
  docState: string,
  docType: string,
}

export default RequestReviewData
