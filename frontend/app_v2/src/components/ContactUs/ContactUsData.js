import api from 'services/api'
/**
 * @summary ContactUsData
 * @version 1.0.0
 * @component
 *
 * @param {object} props
 *
 */
function ContactUsData({ dialectId, contactEmail }) {
  const handleSubmit = (event) => {
    event.preventDefault()
    const { name, email, message } = event.target.elements
    const params = {
      docId: dialectId,
      name: name.value,
      email: email.value,
      message: message.value,
      recipientEmail: contactEmail,
    }
    if (name.value === '' || email.value === '' || message.value === '') {
      //   console.log('Missing!!!!', params)
      return
    }

    api.postMail(params)
    // console.log('Submit', params)
  }
  return {
    handleSubmit,
  }
}

export default ContactUsData
