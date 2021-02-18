import React from 'react'
import PropTypes from 'prop-types'

/**
 * @summary WelcomePresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {string} audio - audio src.
 * @param {string} title - title of the widget
 * @param {string} heading - the main text
 *
 * @returns {node} jsx markup
 */
function WelcomePresentation({ audio, heading, title }) {
  return (
    <section key={title} className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="mb-12 text-3xl text-fv-blue font-bold sm:text-4xl">{heading}</h2>
        {audio && <audio className="w-7/12 text-black mx-auto" src={audio} controls />}
      </div>
    </section>
  )
}
// PROPTYPES
const { string, node } = PropTypes
WelcomePresentation.propTypes = {
  audio: node,
  heading: string,
  title: string,
}

export default WelcomePresentation
