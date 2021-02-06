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
function ContactUsContainer() {
  const { exampleOutput } = ContactUsData({ exampleInput: 'passedInToData' })
  return <ContactUsPresentation exampleProp={exampleOutput} />
}
// PROPTYPES
// const { string } = PropTypes
ContactUsContainer.propTypes = {
  //   something: string,
}

export default ContactUsContainer
