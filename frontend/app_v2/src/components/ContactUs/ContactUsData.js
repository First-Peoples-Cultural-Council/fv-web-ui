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
function ContactUsData({ dialectId, siteEmail }) {
  const [errorMessage, setErrorMessage] = useState(null)
  const contactFormRef = useRef()
  const validator = yup.object().shape({
    contactName: yup.string().min(3).required('A name is required'),
    contactEmail: yup.string().email().required('A valid email is required'),
    contactMessage: yup.string().min(3).required('A message is required'),
  })

  const handleSubmit = async (event) => {
    event.preventDefault()

    const formData = getFormData({ formReference: contactFormRef })
    const validationResults = await validateForm({ formData, validator })

    if (validationResults.valid) {
      api.postMail({
        docId: dialectId,
        name: formData.contactName,
        email: formData.contactEmail,
        message: formData.contactMessage,
        recipientEmail: siteEmail,
      })
    } else {
      setErrorMessage(validationResults.errors[0].message)
    }
  }
  return {
    contactFormRef,
    errorMessage,
    handleSubmit,
  }
}

export default ContactUsData
