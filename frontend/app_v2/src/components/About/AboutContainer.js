import React from 'react'
// import PropTypes from 'prop-types'
import Hero from 'components/Hero'
import Content from 'components/Content'
import AboutData from 'components/About/AboutData'

/**
 * @summary AboutContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function AboutContainer() {
  return (
    <AboutData>
      {({ hero, content }) => {
        const { background: heroBackground, foreground: heroForeground, foregroundIcon: heroIcon } = hero
        const { heading: contentHeading, body: contentBody } = content
        return (
          <>
            <Hero.Presentation
              // variant="left"
              background={heroBackground}
              foreground={<h1 className="font-bold text-5xl">{heroForeground}</h1>}
              foregroundIcon={heroIcon}
            />
            <Content.Presentation heading={contentHeading} body={<>{contentBody}</>} />
          </>
        )
      }}
    </AboutData>
  )
}
// PROPTYPES
// const { string } = PropTypes
AboutContainer.propTypes = {
  //   something: string,
}

export default AboutContainer
