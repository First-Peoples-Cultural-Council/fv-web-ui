import React from 'react'
import PropTypes from 'prop-types'

/**
 * @summary AboutPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function AboutPresentation({ title, text, image, link }) {
  return (
    <section className="py-6 mx-10" data-testid="AboutPresentation">
      <div className="lg:inline-flex">
        <div className="z-10 lg:-mr-20 lg:w-2/4 p-6 bg-white my-11">
          <h2 className="mb-6 lg:text-4xl text-secondary font-bold text-3xl">
            <span className="inline-block">{title}</span>
          </h2>
          <div
            className="
            z-10
            text-bold
            text-justify
            text-fv-charcoal
            inline-block
            mb-6
            lg:mb-10"
          >
            {text}
          </div>
          {link && (
            <a className="bg-secondary text-white px-4 py-4 rounded-lg font-bold text-l" href={link.href}>
              {link.title}
            </a>
          )}
        </div>
        <div className="z-9 my-auto">
          <img src={image.href} />
        </div>
      </div>
    </section>
  )
}

// PROPTYPES
const { string, shape } = PropTypes

AboutPresentation.propTypes = {
  title: string.isRequired,
  text: string.isRequired,
  link: shape({
    title: string,
    href: string,
  }),
  image: shape({
    href: string,
  }),
}

AboutPresentation.defaultProps = {
  link: null,
  image: null,
}

export default AboutPresentation
