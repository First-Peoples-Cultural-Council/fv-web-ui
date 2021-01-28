import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary HeroPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function HeroPresentation({ background, foreground, foregroundIcon, variant }) {
  if (!background && !foreground && !foregroundIcon) {
    return null
  }
  const styles = background
    ? {
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.67), rgba(0, 0, 0, 0.67)), url(${background})`,
      }
    : {}
  const withBG = `text-white ${variant === 'center' ? 'h-96' : 'py-8'}`
  const withoutBG = `text-gray-500 bg-gray-100 ${variant === 'center' ? 'py-16' : 'py-8'}`
  return (
    <section
      data-testid="HeroPresentation"
      className={`
      flex
      justify-center
      ${background ? withBG : withoutBG}
    `}
      style={styles}
    >
      {(foreground || foregroundIcon) && (
        <div
          data-testid="HeroPresentation__foreground"
          className={`
            flex
            flex-grow
            flex-initial
            items-center
            max-w-screen-xl
            px-8
            ${variant === 'center' ? 'flex-col justify-center' : 'flex-row justify-start'}
          `}
        >
          <div className={variant === 'center' ? 'mb-5' : 'mr-5'}>{foregroundIcon}</div>
          {foreground}
        </div>
      )}
    </section>
  )
}
// PROPTYPES
const { node, oneOf } = PropTypes
HeroPresentation.propTypes = {
  background: node,
  foreground: node,
  foregroundIcon: node,
  variant: oneOf(['left', 'center']),
}
HeroPresentation.defaultProps = {
  variant: 'center',
}

export default HeroPresentation
