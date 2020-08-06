import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'
//FPCC
import useIntl from 'DataSource/useIntl'
import useLogin from 'DataSource/useLogin'
import useRoute from 'DataSource/useRoute'
import useTasks from 'DataSource/useTasks'
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
 * @param {string} docType The type of document: 'FVWord', 'FVPhrase', 'FVBook', or 'FVCharacter'.
 */
function RequestReviewData({ children, docId, docState, docType }) {
  const { intl } = useIntl()
  const { computeLogin } = useLogin()
  const { routeParams } = useRoute()
  const { createTask, computeTasks, fetchTasks } = useTasks()

  const workspaces = routeParams.area === WORKSPACES
  const dialectName = routeParams.dialect_name

  // Check if user is an Admin and if so, hide "Request review" button
  const hideButton = ProviderHelpers.isAdmin(computeLogin)

  const docVisibility = convertStateToVisibility(docState)
  const docTypeName = convertToFriendlyType(docType)

  // Set local state for visibility
  const [requestVisibilityType, setRequestVisibilityType] = useState(convertStateToVisibility(docState))

  const [hasRelatedTasks, setHasRelatedTasks] = useState(false)

  // Set up Dialog and Snackbar state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  useEffect(() => {
    ProviderHelpers.fetchIfMissing(docId, fetchTasks, computeTasks)
  }, [])

  // Compute related tasks
  const extractComputeTasks = ProviderHelpers.getEntry(computeTasks, docId)
  const fetchDocumentAction = selectn('action', extractComputeTasks)
  const relatedTasks = selectn('response.entries', extractComputeTasks)

  // Check for relatedTasks when computeTasks finishes
  useEffect(() => {
    if (fetchDocumentAction === 'FV_TASKS_EXECUTE_SUCCESS' && relatedTasks.length) {
      setHasRelatedTasks(true)
    }
  }, [fetchDocumentAction])

  const handleRequestReview = () => {
    setIsDialogOpen(true)
  }

  // triggered by OnChange from VisibilitySelect
  const handleVisibilityChange = (event) => {
    // Set requested visibility in local state
    setRequestVisibilityType(event.target.value)
  }

  const handleDialogCancel = () => {
    setIsDialogOpen(false)
    setRequestVisibilityType(convertStateToVisibility(docState))
  }

  const handleDialogOk = () => {
    setIsDialogOpen(false)
    sendReviewRequest()
    setSnackbarOpen(true)
    setHasRelatedTasks(true)
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarOpen(false)
  }

  // NB The following actions trigger tasks with the following property values for 'nt:type':
  // 'Task2300' which correlates to enableTask
  // 'Task297b' which correlates to disableTask
  // 'Task6b8' which correlates to publishTask
  // 'Task11b1' which correlates to unpublishTask

  const askToPublishAction = () => {
    createTask(
      docId,
      { id: 'FVPublishLanguageAsset', start: 'true' },
      null,
      intl.trans(
        'views.hoc.view.request_to_publish_x_successfully_submitted',
        'Request to publish ' + docTypeName + ' successfully submitted!',
        'first',
        [docTypeName]
      ),
      null
    )
  }

  const askToUnpublishAction = () => {
    createTask(
      docId,
      { id: 'FVUnpublishLanguageAsset', start: 'true' },
      null,
      intl.trans(
        'views.hoc.view.request_to_unpublish_x_successfully_submitted',
        'Request to unpublish ' + docTypeName + ' successfully submitted!',
        'first',
        [docTypeName]
      ),
      null
    )
  }

  const askToEnableAction = () => {
    createTask(
      docId,
      { id: 'FVEnableLanguageAsset', start: 'true' },
      null,
      intl.trans(
        'views.hoc.view.request_to_enable_x_successfully_submitted',
        'Request to enable ' + docTypeName + ' successfully submitted!',
        'first',
        [docTypeName]
      ),
      null
    )
  }

  const askToDisableAction = () => {
    createTask(
      docId,
      { id: 'FVDisableLanguageAsset', start: 'true' },
      null,
      intl.trans(
        'views.hoc.view.request_to_disable_x_successfully_submitted',
        'Request to disable ' + docTypeName + ' successfully submitted!',
        'first',
        [docTypeName]
      ),
      null
    )
  }

  const sendReviewRequest = () => {
    // Send request to the server to set related task for the document
    switch (true) {
      case docVisibility === 'team' && requestVisibilityType === 'team':
        return askToDisableAction()
      case docVisibility === 'team' && requestVisibilityType === 'members':
        return askToEnableAction()
      case docVisibility === 'team' && requestVisibilityType === 'public':
        return askToPublishAction()
      case docVisibility === 'members' && requestVisibilityType === 'team':
        return askToDisableAction()
      case docVisibility === 'members' && requestVisibilityType === 'members':
        return askToEnableAction()
      case docVisibility === 'members' && requestVisibilityType === 'public':
        return askToPublishAction()
      case docVisibility === 'public' && requestVisibilityType === 'team':
        return askToDisableAction()
      case docVisibility === 'public' && requestVisibilityType === 'members':
        return askToUnpublishAction()
      case docVisibility === 'public' && requestVisibilityType === 'public':
        return askToPublishAction()
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
    hasRelatedTasks,
    hideButton,
    workspaces,
    // Dialog
    isDialogOpen,
    handleDialogCancel,
    handleDialogOk,
    requestVisibilityType,
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
