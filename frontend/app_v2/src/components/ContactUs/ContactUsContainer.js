import React from 'react'
// import PropTypes from 'prop-types'
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
function ContactUsContainer({ contactText, title, email, links }) {
  const { handleSubmit } = ContactUsData({ recipientEmail: email })
  return <ContactUsPresentation contactText={contactText} title={title} handleSubmit={handleSubmit} links={links} />
}
// PROPTYPES
// const { string } = PropTypes
ContactUsContainer.propTypes = {
  //   something: string,
}

export default ContactUsContainer
