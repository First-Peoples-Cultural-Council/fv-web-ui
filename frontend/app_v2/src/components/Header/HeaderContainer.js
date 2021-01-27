import React from 'react'
// import PropTypes from 'prop-types'
import HeaderPresentation from 'components/Header/HeaderPresentation'
import HeaderData from 'components/Header/HeaderData'

/**
 * @summary HeaderContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function HeaderContainer({ children }) {
  return (
    <HeaderData>
      {(HeaderDataOutput) => {
        // TODO FW-Header
        // eslint-disable-next-line
        console.log('HeaderDataOutput', HeaderDataOutput)
        return <HeaderPresentation>{children}</HeaderPresentation>
      }}
    </HeaderData>
  )
}
// PROPTYPES
// const { string } = PropTypes
HeaderContainer.propTypes = {
  //   something: string,
}

export default HeaderContainer
