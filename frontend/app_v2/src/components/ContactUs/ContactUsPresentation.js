import React from 'react'
import PropTypes from 'prop-types'

import useIcon from 'common/useIcon'
/**
 * @summary ContactUsPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ContactUsPresentation({ title, contactFormRef, contactText, formErrors, links, handleSubmit }) {
  const getIconName = (link) => {
    if (link.includes('facebook')) {
      return 'Facebook'
    }
    if (link.includes('youtube')) {
      return 'Youtube'
    }
    if (link.includes('twitter')) {
      return 'Twitter'
    }
    if (link.includes('instagram')) {
      return 'Instagram'
    }
    return 'Link'
  }

  const socialIcons = links
    ? links.map((link) => (
        <li key={getIconName(link)} className="mr-3 h-9 w-9 inline-flex align-center rounded text-primary">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="py-1 flex items-start rounded-lg hover:bg-gray-50"
          >
            {useIcon(getIconName(link), 'fill-current h-8 w-8')}
          </a>
        </li>
      ))
    : null

  const errorListItems = formErrors
    ? formErrors.map((formError, index) => (
        <li key={index} className="text-red-500 italic">
          {formError.message}
        </li>
      ))
    : null

  return (
    <section className="bg-white py-6 mx-10">
      <div className="relative mx-10">
        <h2 className="mb-12 relative z-10 text-center text-4xl text-primary font-bold sm:text-5xl">
          <span className="inline-block px-4 sm:px-8 lg:px-20 bg-white">{title}</span>
        </h2>
        <hr className="absolute z-0 w-full" style={{ top: '50%' }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-6">
          <form ref={contactFormRef} className="col-span-6 sm:col-span-3" onSubmit={handleSubmit}>
            <div className="grid grid-cols-7 gap-3">
              {errorListItems && <ul className="col-start-3 col-span-4">{errorListItems}</ul>}
              <label className="col-span-2 tracking-wide text-primary text-xl font-bold mb-2" htmlFor="Name">
                NAME:
              </label>
              <input
                className="col-span-5 bg-white border border-gray-500 rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="Name"
                name="Name"
                type="text"
              />
              <label className="col-span-2 tracking-wide text-primary text-xl font-bold mb-2" htmlFor="Email">
                E-MAIL:
              </label>
              <input
                className="col-span-5 inline bg-white border border-gray-500 rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="Email"
                name="Email"
                type="email"
              />
              <div className="col-span-7">
                <label className="block tracking-wide text-primary text-xl font-bold mb-2" htmlFor="Message">
                  MESSAGE:
                </label>
                <textarea
                  className=" no-resize appearance-none block w-full bg-white border border-gray-500 rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 h-48 resize-none"
                  id="Message"
                  name="Message"
                  defaultValue={''}
                />
              </div>
            </div>
            <button
              className="flex items-center shadow bg-primary hover:bg-primary-dark focus:shadow-outline text-white font-bold ml-3 py-2 px-4 rounded-lg"
              type="submit"
            >
              Submit
            </button>
          </form>
          <div className="col-span-6 sm:col-start-5 sm:col-span-2 mt-8 sm:mt-0">
            <h3 className="block tracking-wide text-primary text-xl font-bold mb-2">ADDRESS</h3>
            <div className="block mb-6" dangerouslySetInnerHTML={{ __html: contactText }} />
            <h3 className="block tracking-wide text-primary text-xl font-bold mb-2">FOLLOW US</h3>
            <ul className="block mb-2">{socialIcons}</ul>
          </div>
        </div>
      </div>
    </section>
  )
}
// PROPTYPES
const { array, func, object, string } = PropTypes
ContactUsPresentation.propTypes = {
  contactFormRef: object,
  contactText: string,
  formErrors: array,
  handleSubmit: func,
  links: array,
  title: string,
}

export default ContactUsPresentation
