import React from 'react'
import PropTypes from 'prop-types'
import ContactUsPresentation from 'components/ContactUs/ContactUsPresentation'
import ContactUsData from 'components/ContactUs/ContactUsData'

/**
 * @summary ContactUsContainer
 * @version 1.0.0
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ContactUsContainer({ contactText, dialectId, links, siteEmail, title }) {
  const { contactFormRef, handleSubmit, errorMessage } = ContactUsData({ siteEmail, dialectId })
  return (
    <ContactUsPresentation
      contactFormRef={contactFormRef}
      contactText={contactText}
      errorMessage={errorMessage}
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
  siteEmail: string,
  title: string,
}

export default ContactUsContainer
