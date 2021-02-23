import React from 'react'
import PropTypes from 'prop-types'
import HeaderPresentation from 'components/Header/HeaderPresentation'
import HeaderData from 'components/Header/HeaderData'

/**
 * @summary HeaderContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function HeaderContainer({ children }) {
  return (
    <HeaderData>
      {
        (/*HeaderDataOutput*/) => {
          return <HeaderPresentation>{children}</HeaderPresentation>
        }
      }
    </HeaderData>
  )
}
// PROPTYPES
const { node } = PropTypes
HeaderContainer.propTypes = {
  children: node,
}

export default HeaderContainer
