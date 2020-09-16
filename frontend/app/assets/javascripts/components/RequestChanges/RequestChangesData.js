import { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { getFormData, handleSubmit } from 'common/FormHelpers'
import * as yup from 'yup'
import Immutable from 'immutable'
import usePortal from 'DataSource/usePortal'
import useRoute from 'DataSource/useRoute'
import usePrevious from 'DataSource/usePrevious'
import useVisibility from 'DataSource/useVisibility'
import useDialect from 'DataSource/useDialect'
import ProviderHelpers from 'common/ProviderHelpers'
import selectn from 'selectn'
import useTasks from 'DataSource/useTasks'
import useIntl from 'DataSource/useIntl'
/**
 * @summary RequestChangesData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function RequestChangesData({ children, docDialectPath, docId, docState, taskId }) {
  const { computePortal } = usePortal()
  const { routeParams } = useRoute()
  const formRef = useRef(null)
  const [errors, setErrors] = useState()
  const [docVisibility, setDocVisibility] = useState('')
  const { fetchDialect2, computeDialect2 } = useDialect()
  const { intl } = useIntl()
  const { rejectTask, extractComputeUserTasksReject = {}, setProcessedTask } = useTasks()
  const {
    updateVisibilityToTeam,
    updateVisibilityToMembers,
    updateVisibilityToPublic,
    extractComputeUpdateVisibility,
  } = useVisibility()

  const computeEntities = Immutable.fromJS([
    {
      id: routeParams.dialect_path,
      entity: computePortal,
    },
  ])

  const handleVisibilityChange = (event) => {
    const newVisibility = event.target.value
    // Set visibility in local state
    setDocVisibility(newVisibility)
  }

  useEffect(() => {
    setDocVisibility(convertStateToVisibility(docState))
  }, [])

  useEffect(() => {
    if (docDialectPath) {
      ProviderHelpers.fetchIfMissing(docDialectPath, fetchDialect2, computeDialect2)
    }
  }, [docDialectPath])

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

  const handleApprove = (event) => {
    // Validates the form data and updates the visibility
    const validator = yup.object().shape({
      visibilitySelect: yup
        .string()
        .label('Document visibility')
        .required('Please specify the audience for this document'),
    })

    event.preventDefault()

    const formData = getFormData({
      formReference: formRef,
    })

    handleSubmit({
      validator,
      formData,
      valid: () => {
        setErrors(undefined)
        updateVisibility(docVisibility)
      },
      invalid: (response) => {
        setErrors(response.errors)
      },
    })
  }

  // USER FEEDBACK: Approval
  const prevAction = usePrevious(selectn('action', extractComputeUpdateVisibility))
  useEffect(() => {
    if (selectn('action', extractComputeUpdateVisibility) !== prevAction) {
      if (selectn('isFetching', extractComputeUpdateVisibility) === false) {
        const success = selectn('success', extractComputeUpdateVisibility)
        const message =
          success === false
            ? selectn('message', extractComputeUpdateVisibility) ||
              'Sorry, we encountered a problem. Please try again later.'
            : 'Document approved'

        const id = selectn('id', extractComputeUpdateVisibility)
        if (id) {
          setProcessedTask({ id, message, isSuccess: success })
        }
      }
    }
  }, [extractComputeUpdateVisibility])

  const onReject = ({ id, comment }) => {
    rejectTask(
      id,
      {
        comment,
        status: 'reject',
      },
      null,
      intl.trans('views.pages.tasks.request_rejected', 'Request Rejected Successfully', 'words')
    )
  }
  const handleRequestChanges = (event) => {
    // Validates the form data and updates the visibility
    const validator = yup.object().shape({
      visibilitySelect: yup.string().label('Document visibility'),
    })

    event.preventDefault()

    const formData = getFormData({
      formReference: formRef,
    })

    handleSubmit({
      validator,
      formData,
      valid: () => {
        setErrors(undefined)
        onReject({ id: taskId })
      },
      invalid: (response) => {
        setErrors(response.errors)
      },
    })
  }
  // USER FEEDBACK: Reject
  const prevRejectAction = usePrevious(selectn('action', extractComputeUserTasksReject))
  useEffect(() => {
    if (selectn('action', extractComputeUserTasksReject) !== prevRejectAction) {
      const { isError, isFetching, message, success } = extractComputeUserTasksReject
      const id = selectn(['response', 'properties', 'nt:targetDocumentsIds', 0], extractComputeUserTasksReject)

      if (id && isFetching === false) {
        let _message
        if (isError === true && success === false) {
          _message = message || 'We encountered a problem rejecting this task'
        }

        if (isError !== true && success === true) {
          _message = message || 'Rejected the request'
        }
        setProcessedTask({ id, message: _message, isSuccess: success })
      }
    }
  }, [extractComputeUserTasksReject])

  const disableApproveButton = () => {
    // The approve button is greyed out if a visibility is not selected
    if (docVisibility === '') {
      return true
    }
    return false
  }

  const disableRequestChangesButton = () => {
    // In future iterations, the request changes button will be greyed out
    // if comments are not provided
    return false
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
  }

  const extractComputeDialect = ProviderHelpers.getEntry(computeDialect2, docDialectPath)
  return children({
    computeEntities,
    disableApproveButton,
    disableRequestChangesButton,
    docVisibility,
    errors,
    formRef,
    handleApprove,
    handleRequestChanges,
    handleSnackbarClose,
    handleVisibilityChange,
    isPublicDialect: selectn('response.state', extractComputeDialect) === 'Published',
  })
}

const { func, string } = PropTypes
RequestChangesData.propTypes = {
  children: func,
  docId: string,
  docState: string,
  taskId: string,
}

export default RequestChangesData
