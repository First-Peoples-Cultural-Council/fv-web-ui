import { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { getFormData, handleSubmit } from 'common/FormHelpers'
import * as yup from 'yup'
import Immutable from 'immutable'
import usePortal from 'DataSource/usePortal'
import useRoute from 'DataSource/useRoute'
import usePrevious from 'DataSource/usePrevious'
import useDialect from 'DataSource/useDialect'
import ProviderHelpers from 'common/ProviderHelpers'
import selectn from 'selectn'
import useTasks from 'DataSource/useTasks'

/**
 * @summary RequestChangesData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @param {function} props.children Render prop
 *
 * @param {string} props.docDialectPath Used to determine if it's a public dialect
 * @param {string} props.docId Used with request to change visibility.
 * @param {string} props.docState Nuxeo 'state' of the document: 'New', 'Enabled', 'Disabled', or 'Published'
 * @param {string} props.taskId Used when rejecting a task
 *
 * @returns {object} Data for RequestChangesPresentation
 */
function RequestChangesData({ children, docDialectPath, docId, docState, taskId }) {
  const { computePortal } = usePortal()
  const { routeParams } = useRoute()
  const formRef = useRef(null)
  const [errors, setErrors] = useState()
  const [docVisibility, setDocVisibility] = useState('')
  const { fetchDialect2, computeDialect2 } = useDialect()
  const {
    setProcessedTask,
    simpleTaskApprove,
    computeSimpleTaskApprove,
    simpleTaskRequestChanges,
    computeSimpleTaskRequestChanges,
  } = useTasks()
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
    event.preventDefault()

    // Validates the form data and updates the visibility
    const validator = yup.object().shape({
      visibilitySelect: yup
        .string()
        .label('Document visibility')
        .required('Please specify the audience for this document'),
    })

    const formData = getFormData({
      formReference: formRef,
    })

    handleSubmit({
      validator,
      formData,
      valid: () => {
        setErrors(undefined)
        simpleTaskApprove({
          id: taskId,
          idTask: taskId,
          idItem: docId,
          visibility: formData.visibilitySelect,
        })
      },
      invalid: (response) => {
        setErrors(response.errors)
      },
    })
  }

  // USER FEEDBACK: simpleTaskApprove
  const prevApprove = usePrevious(selectn('isFetching', computeSimpleTaskApprove))
  useEffect(() => {
    if (selectn('isFetching', computeSimpleTaskApprove) !== prevApprove) {
      if (selectn('isFetching', computeSimpleTaskApprove) === false) {
        const isSuccess = selectn('isSuccess', computeSimpleTaskApprove)
        const message =
          isSuccess === false
            ? selectn('message', computeSimpleTaskApprove) || 'Sorry, we encountered a problem. Please try again later.'
            : 'Document approved'

        const idTask = selectn('idTask', computeSimpleTaskApprove)
        if (idTask) {
          setProcessedTask({
            idTask,
            idItem: selectn('idItem', computeSimpleTaskApprove),
            message,
            isSuccess,
          })
        }
      }
    }
  }, [computeSimpleTaskApprove])

  const handleRequestChanges = (event) => {
    event.preventDefault()

    // Validates the form data and updates the visibility
    const validator = yup.object().shape({
      visibilitySelect: yup.string().label('Document visibility'),
    })

    const formData = getFormData({
      formReference: formRef,
    })

    handleSubmit({
      validator,
      formData,
      valid: () => {
        setErrors(undefined)
        simpleTaskRequestChanges({
          id: taskId,
          idTask: taskId,
          idItem: docId,
          visibility: formData.visibilitySelect,
          comment: formData.comment,
        })
      },
      invalid: (response) => {
        setErrors(response.errors)
      },
    })
  }

  // USER FEEDBACK: Reject
  const prevRequestChanges = usePrevious(selectn('isFetching', computeSimpleTaskRequestChanges))
  useEffect(() => {
    if (selectn('isFetching', computeSimpleTaskRequestChanges) !== prevRequestChanges) {
      const { idTask, idItem, message, isFetching, isSuccess } = computeSimpleTaskRequestChanges

      if (idTask && isFetching === false) {
        let _message
        if (isSuccess === false) {
          _message = message || 'We encountered a problem sharing your feedback'
        }

        if (isSuccess === true) {
          _message = message || 'We shared your feedback with the member'
        }
        setProcessedTask({
          idTask,
          idItem,
          message: _message,
          isSuccess,
        })
      }
    }
  }, [computeSimpleTaskRequestChanges])

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
