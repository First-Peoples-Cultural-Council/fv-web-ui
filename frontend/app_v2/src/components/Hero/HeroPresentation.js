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
    ? { backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.67), rgba(0, 0, 0, 0.67)), url(${background})` }
    : {}

  const classNamesWithBackground = 'text-white bg-no-repeat bg-cover bg-center'
  const classNamesWithoutBackground = 'text-gray-500 bg-gray-100'
  let classNamesForeground = ''
  let classNamesForegroundIcon = ''
  let classNamesContainer = 'flex justify-center relative'

  switch (variant) {
    case WIDGET_HERO_CENTER: {
      classNamesForeground = 'flex-col justify-center px-8'
      classNamesForegroundIcon = 'mb-1'
      classNamesContainer = background
        ? `${classNamesContainer} ${classNamesWithBackground} h-96`
        : `${classNamesContainer} ${classNamesWithoutBackground} py-16`
      break
    }
    case WIDGET_HERO_LEFT: {
      classNamesForeground = 'flex-row justify-start px-5'
      classNamesForegroundIcon = 'mr-1'
      classNamesContainer = `${classNamesContainer} ${classNamesWithoutBackground} py-8`
      break
    }
    case WIDGET_HERO_SEARCH: {
      // On small devices - community logo in nav is sufficient
      classNamesForeground = 'hidden lg:flex flex-col justify-center lg:justify-end pb-7'
      classNamesForegroundIcon = 'mb-2'
      classNamesContainer = `
        ${classNamesContainer}
        ${background ? `${classNamesWithBackground}` : 'text-white bg-gradient-to-r from-gray-600 to-gray-700 py-16'}
        grid gap-3 grid-cols-none lg:grid-cols-4`
      if (background) {
        containerStyles = Object.assign({}, containerStyles, {
          backgroundImage: `url(${background})`,
          minHeight: '500px',
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
          className="absolute
          inset-x-0
          bottom-0
          z-0
          bg-gradient-to-b
          from-word
          to-word-dark
          h-1/5
          lg:h-1/4"
        >
          <div className="justify-center mt-6 lg:mt-8 lg:w-5/12 mx-auto">
            {/*place-self-center md:place-self-auto items-center justify-center md:justify-start lg:w-10/12*/}
            <div className="mr-4 ml-4 lg:mr-audio lg:ml-auto">{search}</div>
          </div>
        </div>
      )}
    </section>
  )
}
// PROPTYPES
const { array, node, string, oneOf } = PropTypes
HeroPresentation.propTypes = {
  error: array,
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
