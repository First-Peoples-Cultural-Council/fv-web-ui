import React from 'react'
import PropTypes from 'prop-types'

import AboutPresentation from 'components/About/AboutPresentation'

/**
 * @summary AboutContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function AboutContainer({ title, text, image, link }) {
  return <AboutPresentation title={title} text={text} image={image} link={link} />
}

const { string, shape } = PropTypes

AboutContainer.propTypes = {
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

export default AboutContainer
