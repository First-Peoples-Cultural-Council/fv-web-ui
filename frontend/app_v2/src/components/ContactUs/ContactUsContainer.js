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
function ContactUsContainer({ contactText, contactEmail, dialectId, links, title }) {
  const { handleSubmit } = ContactUsData({ contactEmail, dialectId })
  return <ContactUsPresentation contactText={contactText} title={title} handleSubmit={handleSubmit} links={links} />
}
// PROPTYPES
const { string, array } = PropTypes
ContactUsContainer.propTypes = {
  contactText: string,
  contactEmail: string,
  dialectId: string,
  links: array,
  title: string,
}

export default ContactUsContainer
