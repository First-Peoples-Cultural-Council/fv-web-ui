import React from 'react'
// import PropTypes from 'prop-types'
import Hero from 'components/Hero'
import Content from 'components/Content'
import AboutData from 'components/About/AboutData'
import { WIDGET_HERO_CENTER } from 'common/constants'
import CircleImage from 'components/CircleImage'
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
  const { hero, content } = AboutData()
  const { background: heroBackground, foreground: heroForeground, foregroundIcon: heroIcon } = hero
  const { heading: contentHeading, body: contentBody } = content
  return (
    <>
      <Hero.Presentation
        variant={WIDGET_HERO_CENTER}
        background={heroBackground}
        foreground={<h1 className="font-bold text-5xl">{heroForeground}</h1>}
        foregroundIcon={
          heroIcon ? <CircleImage.Presentation src={heroIcon} classNameWidth="w-28" classNameHeight="h-28" /> : null
        }
      />
      <Content.Presentation heading={contentHeading} body={<>{contentBody}</>} />
    </>
  )
}
// PROPTYPES
// const { string } = PropTypes
AboutContainer.propTypes = {
  //   something: string,
}

export default AboutContainer
