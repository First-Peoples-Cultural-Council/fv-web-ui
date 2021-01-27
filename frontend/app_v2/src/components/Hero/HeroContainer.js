import React from 'react'
// import PropTypes from 'prop-types'
import HeroPresentation from 'components/Hero/HeroPresentation'
import HeroData from 'components/Hero/HeroData'

/**
 * @summary HeroContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function HeroContainer() {
  return (
    <HeroData>
      {
        (/*HeroDataOutput*/) => {
          return <HeroPresentation />
        }
      }
    </HeroData>
  )
}
// PROPTYPES
// const { string } = PropTypes
HeroContainer.propTypes = {
  //   something: string,
}

export default HeroContainer
