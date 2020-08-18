import PropTypes from 'prop-types'
import { getFormData, handleSubmit } from 'common/FormHelpers'
import * as yup from 'yup'
import { useRef, useState, useEffect } from 'react'
import Immutable from 'immutable'
import usePortal from 'DataSource/usePortal'
import useRoute from 'DataSource/useRoute'
import useVisibility from 'DataSource/useVisibility'
// import ProviderHelpers from 'common/ProviderHelpers'
// import selectn from 'selectn'

/**
 * @summary RequestChangesData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function RequestChangesData({ children, docId, docState }) {
  const { computePortal } = usePortal()
  const { routeParams } = useRoute()
  const formRef = useRef(null)
  const [errors, setErrors] = useState()
  const [snackbarStatus, setSnackbarStatus] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState(null)
  const [docVisibility, setDocVisibility] = useState('')
  const {
    updateVisibilityToTeam,
    updateVisibilityToMembers,
    updateVisibilityToPublic /*, computeUpdateVisibility */,
  } = useVisibility()

  // PRO: doesn't infinite loop
  // TODO: displays error message when re-entering page
  //
  // const extractComputeUpdateVisibility = ProviderHelpers.getEntry(computeUpdateVisibility, docId)
  // useEffect(() => {
  //   const newSnackbarMessage = selectn('message', extractComputeUpdateVisibility) || 'Sorry we encountered a problem'
  //   if (selectn('isError', extractComputeUpdateVisibility) && snackbarMessage !== newSnackbarMessage) {
  //     setSnackbarMessage(newSnackbarMessage)
  //     setSnackbarStatus(true)
  //   }
  // }, [extractComputeUpdateVisibility])

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

        // TODO: re-enable the following. Disabled because: "how to handle error originating from server?"
        // setSnackbarMessage('Document approved')
        // setSnackbarStatus(true)
      },
      invalid: (response) => {
        setErrors(response.errors)
      },
    })
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
        updateVisibility(docVisibility)
        setSnackbarMessage('Changes requested')
        setSnackbarStatus(true)
      },
      invalid: (response) => {
        setErrors(response.errors)
      },
    })
  }

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
    setSnackbarStatus(false)
  }

  return children({
    computeEntities,
    disableApproveButton,
    disableRequestChangesButton,
    docVisibility,
    errors,
    formRef,
    handleApprove,
    handleRequestChanges,
    handleVisibilityChange,
    handleSnackbarClose,
    snackbarMessage,
    snackbarStatus,
  })
}

const { func, string } = PropTypes
RequestChangesData.propTypes = {
  children: func,
  docId: string,
  docState: string,
}

export default RequestChangesData
