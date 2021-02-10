import React from 'react'
import PropTypes from 'prop-types'
import DialectHeaderPresentation from 'components/DialectHeader/DialectHeaderPresentation'
import DialectHeaderData from 'components/DialectHeader/DialectHeaderData'

/**
 * @summary DialectHeaderContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function DialectHeaderContainer({ className }) {
  const { currentUser, menuData, title } = DialectHeaderData()
  return <DialectHeaderPresentation className={className} title={title} currentUser={currentUser} menuData={menuData} />
}
// PROPTYPES
const { string } = PropTypes
DialectHeaderContainer.propTypes = {
  className: string,
}

export default DialectHeaderContainer
