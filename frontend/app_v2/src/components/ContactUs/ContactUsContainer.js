import React from 'react'
import PropTypes from 'prop-types'
import ContactUsPresentation from 'components/ContactUs/ContactUsPresentation'
import ContactUsData from 'components/ContactUs/ContactUsData'

/**
 * @summary ContactUsContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ContactUsContainer({ contactText, dialectId, links, contactEmail, title }) {
  const { contactFormRef, formErrors, handleSubmit } = ContactUsData({ contactEmail, dialectId })
  return (
    <ContactUsPresentation
      contactFormRef={contactFormRef}
      contactText={contactText}
      formErrors={formErrors}
      title={title}
      handleSubmit={handleSubmit}
      links={links}
    />
  )
}
// PROPTYPES
const { string, array } = PropTypes
ContactUsContainer.propTypes = {
  contactText: string,
  dialectId: string,
  links: array,
  contactEmail: string.isRequired,
  title: string,
}

export default ContactUsContainer
