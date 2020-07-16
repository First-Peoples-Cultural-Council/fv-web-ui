import PropTypes from 'prop-types'
import {getFormData, handleSubmit} from 'common/FormHelpers'
import * as yup from 'yup'
import {useRef, useState} from 'react'

/**
 * @summary RequestChangesData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function RequestChangesData({children}) {
  console.log("First line")
  const formRef = useRef(null)
  const [errors, setErrors] = useState()

  const validator = yup.object().shape({
    'commentField': yup
    .string()
    .label('Comment label')
    .required('ERROR: Comment field is required'),
  })
  const onSubmit = (event) => {
    console.log("hello")
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
      },
      invalid: (response) => {
        console.log('onSubmit > form is invalid', {errorsHere: response.errors})
        setErrors(response.errors)
      },
    })
  }

  return children({
    formRef,
    onSubmit,
    errors,
  })
}

// PROPTYPES
const {func} = PropTypes
RequestChangesData.propTypes = {
  children: func,
}

export default RequestChangesData
