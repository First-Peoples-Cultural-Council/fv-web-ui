import { useRef, useState } from 'react'
import * as yup from 'yup'

import api from 'services/api'
import { getFormData, validateForm } from 'common/FormHelpers'
/**
 * @summary ContactUsData
 * @version 1.0.0
 * @component
 *
 * @param {object} props
 *
 */
function ContactUsData({ dialectId, contactEmail }) {
  const [formErrors, setFormErrors] = useState([])
  const contactFormRef = useRef()
  const validator = yup.object().shape({
    Name: yup.string().min(3).required('A name is required'),
    Email: yup.string().email().required('A valid email is required'),
    Message: yup.string().min(3).required('A message is required'),
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    // Clear out errors from any previous submits
    setFormErrors([])

    const formData = getFormData({ formReference: contactFormRef })
    const validationResults = await validateForm({ formData, validator })

    if (validationResults.valid) {
      api.postMail({
        docId: dialectId,
        name: formData.Name,
        email: formData.Email,
        message: formData.Message,
        recipientEmail: contactEmail,
      })
    } else {
      setFormErrors(validationResults.errors)
    }
  }
  return {
    contactFormRef,
    formErrors,
    handleSubmit,
  }
}

export default ContactUsData
