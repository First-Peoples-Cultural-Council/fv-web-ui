import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import useIcon from 'common/useIcon'
/**
 * @summary ContactUsPresentation
 * @version 1.0.0
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ContactUsPresentation({ title, contactText, links }) {
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
        <li key={getIconName(link)} className="mr-3 h-9 w-9 inline-flex align-center rounded text-fv-turquoise">
          <Link to={link} className="py-1 flex items-start rounded-lg hover:bg-gray-50">
            {useIcon(getIconName(link), 'fill-current h-8 w-8')}
          </Link>
        </li>
      ))
    : null

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center mb-12 text-4xl text-fv-blue font-bold uppercase sm:text-5xl">{title}</h2>
        <div className="grid grid-cols-6">
          <form className="col-span-6 sm:col-span-3">
            <div className="grid grid-cols-7 gap-3">
              <label className="col-span-2 uppercase tracking-wide text-fv-blue text-xl font-bold mb-2" htmlFor="name">
                Name:
              </label>
              <input
                className="col-span-5 bg-white border border-gray-500 rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="name"
                type="text"
              />
              {/* <p className="col-start-2 col-span-5 text-red-500 text-xs italic">Please fill out this field.</p> */}
              <label
                className="col-span-2 uppercase tracking-wide text-fv-blue text-xl font-bold mb-2"
                htmlFor="message"
              >
                E-mail:
              </label>
              <input
                className="col-span-5 inline bg-white border border-gray-500 rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="email"
                type="email"
              />
              <div className="col-span-7">
                <label className="block uppercase tracking-wide text-fv-blue text-xl font-bold mb-2" htmlFor="message">
                  Message:
                </label>
                <textarea
                  className=" no-resize appearance-none block w-full bg-white border border-gray-500 rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 h-48 resize-none"
                  id="message"
                  defaultValue={''}
                />
              </div>
            </div>
            <button
              className="flex items-center shadow bg-fv-blue hover:bg-fv-blue-dark focus:shadow-outline focus:outline-none text-white font-bold ml-3 py-2 px-4 rounded-3xl"
              type="button"
            >
              Submit
            </button>
          </form>
          <div className="col-span-6 sm:col-start-5 sm:col-span-2 mt-8 sm:mt-0">
            <h3 className="block uppercase tracking-wide text-fv-blue text-xl font-bold mb-2">Contact Information</h3>
            <div className="block mb-6" dangerouslySetInnerHTML={{ __html: contactText }} />
            <h3 className="block uppercase tracking-wide text-fv-blue text-xl font-bold mb-2">Follow us</h3>
            <ul className="block mb-2">{socialIcons}</ul>
          </div>
        </div>
      </div>
    </section>
  )
}
// PROPTYPES
const { array, string } = PropTypes
ContactUsPresentation.propTypes = {
  title: string,
  contactText: string,
  links: array,
}

export default ContactUsPresentation
