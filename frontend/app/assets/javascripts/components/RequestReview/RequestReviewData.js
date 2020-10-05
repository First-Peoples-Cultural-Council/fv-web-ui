import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'
//FPCC
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
  const { computeLogin } = useLogin()
  const { routeParams } = useRoute()
  const { computeTasks, fetchTasks, postRequestReview } = useTasks()

  const workspaces = routeParams.area === WORKSPACES
  const dialectName = routeParams.dialect_name

  // Check if user is an Admin and if so, hide "Request review" button
  const hideButton = ProviderHelpers.isAdmin(computeLogin)

  const docVisibility = convertStateToVisibility(docState)
  const docTypeName = convertToFriendlyType(docType)

  // Set local state for visibility, comment, and related tasks
  const [requestVisibilityType, setRequestVisibilityType] = useState(convertStateToVisibility(docState))
  const [hasRelatedTasks, setHasRelatedTasks] = useState(false)
  const [comment, setComment] = useState(false)

  // Set up Dialog and Snackbar state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  useEffect(() => {
    fetchTasks(docId)
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

  const handleTextFieldChange = (event) => {
    setComment(event.target.value)
  }

  const handleDialogCancel = () => {
    setIsDialogOpen(false)
    setRequestVisibilityType(convertStateToVisibility(docState))
    setComment('')
  }

  const handleDialogOk = () => {
    setIsDialogOpen(false)
    // Send request to the server to set related task for the document
    postRequestReview(docId, requestVisibilityType, comment)
    setSnackbarOpen(true)
    setHasRelatedTasks(true)
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarOpen(false)
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
        return state
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
    handleTextFieldChange,
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
