import React from 'react'
import PropTypes from 'prop-types'
import {getFormData, handleSubmit} from 'common/FormHelpers'
import * as yup from 'yup'
import {useRef, useState, useEffect} from 'react'
import Immutable from 'immutable'
import usePortal from 'DataSource/usePortal'
import useRoute from 'DataSource/useRoute'
import useVisibility from "../../common/DataSource/useVisibility";
import FVSnackbar from "../../views/components/FVSnackbar";

/**
 * @summary RequestChangesData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function RequestChangesData({children, docId, docState}) {
  const {computePortal} = usePortal()
  const {routeParams} = useRoute()
  const formRef = useRef(null)
  const [errors, setErrors] = useState()
  let [snackbarStatus, setSnackbarStatus] = useState(false)
  const [submitMethod, setSubmitMethod] = useState(null)

  const [docVisibility, setDocVisibility] = useState('')
  const {updateVisibilityToTeam, updateVisibilityToMembers, updateVisibilityToPublic} = useVisibility()

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

  const computeEntities = Immutable.fromJS([
    {
      id: routeParams.dialect_path,
      entity: computePortal,
    },
  ])

  const validator = yup.object().shape({
    visibilitySelect: yup
    .string()
    .label('Document visibility')
    .required('Please specify the audience for this document'),
  })


  const onSubmit = (event) => {
    console.log('hello from submit')
    event.preventDefault()

    const formData = getFormData({
      formReference: formRef,
    })

    console.log('onSubmit > here is the form data:', {formData})

    handleSubmit({
      validator,
      formData,
      valid: () => {
        console.log('onSubmit > form is valid')
        setErrors(undefined)
        setSnackbarStatus(true)
      },
      invalid: (response) => {
        console.log('onSubmit > form is invalid', {errorsHere: response.errors})
        setErrors(response.errors)
      },
    })

  }
  const handleApprove = (event) => {
    setSubmitMethod('approve')
    console.log('hello from submit')
    event.preventDefault()

    const formData = getFormData({
      formReference: formRef,
    })

    console.log('onSubmit > here is the form data:', {formData})

    handleSubmit({
      validator,
      formData,
      valid: () => {
        console.log('onSubmit > form is valid')
        setErrors(undefined)
        setSnackbarStatus(true)
      },
      invalid: (response) => {
        console.log('onSubmit > form is invalid', {errorsHere: response.errors})
        setErrors(response.errors)
      },
    })
  }

  const handleRequestChanges = (event) => {
    setSubmitMethod('requestChanges')
    console.log('hello from requestChanges')
    event.preventDefault()

    const formData = getFormData({
      formReference: formRef,
    })

    console.log('onSubmit > here is the form data:', {formData})

    handleSubmit({
      validator,
      formData,
      valid: () => {
        console.log('onSubmit > form is valid')
        setErrors(undefined)
        setSnackbarStatus(true)
      },
      invalid: (response) => {
        console.log('onSubmit > form is invalid', {errorsHere: response.errors})
        setErrors(response.errors)
      },
    })
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarStatus(false)
  }

  return children({
    computeEntities,
    docVisibility,
    errors,
    formRef,
    handleApprove,
    handleRequestChanges,
    handleVisibilityChange,
    handleSnackbarClose,
    onSubmit,
    snackbarStatus,
  })
}

// PROPTYPES
const {func} = PropTypes
RequestChangesData.propTypes = {
  children: func,
}

export default RequestChangesData
