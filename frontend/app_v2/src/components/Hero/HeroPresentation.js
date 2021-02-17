import React from 'react'
import PropTypes from 'prop-types'
import { WIDGET_HERO_CENTER, WIDGET_HERO_LEFT, WIDGET_HERO_SEARCH } from 'common/constants'
/**
 * @summary HeroPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function HeroPresentation({ background, foreground, foregroundIcon, search, variant }) {
  if (!background && !foreground && !foregroundIcon) {
    return null
  }
  let containerStyles = background
    ? {
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.67), rgba(0, 0, 0, 0.67)), url(${background})`,
      }
    : {}

  const classNamesWithBackground = 'text-white bg-no-repeat bg-cover bg-center'
  const classNamesWithoutBackground = 'text-gray-500 bg-gray-100'
  let classNamesForeground = ''
  let classNamesForegroundIcon = ''
  let classNamesContainer = 'flex justify-center relative'

  switch (variant) {
    case WIDGET_HERO_CENTER: {
      classNamesForeground = 'flex-col justify-center px-8'
      classNamesForegroundIcon = 'mb-5'
      classNamesContainer = background
        ? `${classNamesContainer} ${classNamesWithBackground} h-96`
        : `${classNamesContainer} ${classNamesWithoutBackground} py-16`
      break
    }
    case WIDGET_HERO_LEFT: {
      classNamesForeground = 'flex-row justify-start px-8'
      classNamesForegroundIcon = 'mr-5'
      classNamesContainer = `${classNamesContainer} ${classNamesWithoutBackground} py-8`
      break
    }
    case WIDGET_HERO_SEARCH: {
      classNamesForeground = `
        flex-col
        justify-center
        md:justify-end
        pb-10
      `
      classNamesForegroundIcon = 'mb-5'
      classNamesContainer = `
        ${classNamesContainer}
        ${
          background
            ? `${classNamesWithBackground} h-96`
            : 'text-white bg-gradient-to-r from-gray-600 to-gray-700 py-16'
        }

        grid
        gap-3
        grid-cols-none
        
        md:grid-cols-3
      `
      if (background) {
        containerStyles = Object.assign({}, containerStyles, {
          backgroundImage: `url(${background})`,
          minHeight: '695px',
        })
      }
      break
    }
    default:
      break
  }
  return (
    <section data-testid="HeroPresentation" className={classNamesContainer} style={containerStyles}>
      {(foreground || foregroundIcon) && (
        <div
          data-testid="HeroPresentation__foreground"
          className={`
            flex
            flex-grow
            flex-initial
            items-center
            max-w-screen-xl
            z-10
            ${classNamesForeground}
          `}
        >
          {foregroundIcon && <div className={classNamesForegroundIcon}>{foregroundIcon}</div>}
          {foreground}
        </div>
      )}
      {variant === WIDGET_HERO_SEARCH && search && (
        <div
          className={`
          absolute
          inset-x-0
          bottom-0
          z-0
          bg-gradient-to-r 
          to-green-600
          from-blue-600

          h-2/4
          md:h-1/4

          grid
          gap-3
          grid-cols-none
          md:grid-cols-3
        `}
        >
          <div
            className={`
            md:col-start-2
            md:col-span-2
            grid
          `}
          >
            <div
              className={`
            place-self-center
            md:place-self-auto

            flex
            items-center
            justify-center
            md:justify-start
            `}
            >
              {search}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
// PROPTYPES
const { node, string, oneOf } = PropTypes
HeroPresentation.propTypes = {
  background: string,
  foreground: node,
  foregroundIcon: node,
  search: node,
  /** Changes layout of component. Variants are: left aligned, center aligned, or search */
  variant: oneOf([WIDGET_HERO_LEFT, WIDGET_HERO_CENTER, WIDGET_HERO_SEARCH]),
}
HeroPresentation.defaultProps = {
  variant: WIDGET_HERO_CENTER,
}

export default HeroPresentation
