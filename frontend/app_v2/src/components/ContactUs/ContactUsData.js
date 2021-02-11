import { useState } from 'react'
import api from 'services/api'
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

  const emailValidation = (email) => {
    if (/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
      return true
    }
    if (email.trim() === '') {
      setErrorMessage('Email is required')
      return false
    }
    setErrorMessage('Please enter a valid email')
    return false
  }

  const textValidation = (fieldName, fieldValue) => {
    if (fieldValue === undefined || fieldValue.trim() === '') {
      setErrorMessage(`${fieldName} is required`)
      return false
    }
    if (fieldValue.trim().length < 3) {
      setErrorMessage(`${fieldName} needs to be at least three characters`)
      return false
    }
    return true
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const { contactName, contactEmail, contactMessage } = event.target.elements
    const params = {
      docId: dialectId,
      name: contactName.value,
      email: contactEmail.value,
      message: contactMessage.value,
      recipientEmail: siteEmail,
    }
    const validEmail = emailValidation(contactEmail.value)
    const validName = textValidation('Name', contactName.value)
    const validMessage = textValidation('Message', contactMessage.value)
    if (validEmail && validName && validMessage) {
      api.postMail(params)
    }
  }
  return {
    errorMessage,
    handleSubmit,
  }
}

export default ContactUsData
