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
  const renderLink = (l) => (
    <a className="bg-fv-orange text-white px-4 py-4 rounded-xl font-bold text-l" href={l.href}>
      {l.title}
    </a>
  )

  return (
    <section className="bg-white" data-testid="AboutPresentation">
      <div className="relative overflow-hidden py-4">
        <div className="z-10 md:w-2/4 md:my-32 md:-right-32 px-6 py-6 bg-white relative ">
          <h2 className="mb-4 lg:mb-10 lg:text-4xl text-fv-orange font-bold text-3xl uppercase">
            <span className="inline-block">{title}</span>
          </h2>
          <span
            className="
            text-bold
            text-justify
            text-fv-charcoal
            inline-block
            mb-4
            lg:mb-10"
          >
            {text}
          </span>
          {link && renderLink(link)}
        </div>
        <div className="invisible md:visible  z-9 my-auto w-2/4 absolute top-2/4 inset-y-0 right-0 w-16">
          <img className="transform -translate-y-2/4" src={image.href} />
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
