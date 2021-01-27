import React from 'react'
// import PropTypes from 'prop-types'
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
function DialectHeaderContainer() {
  return (
    <DialectHeaderData>
      {({ currentUser }) => {
        return <DialectHeaderPresentation currentUser={currentUser} />
      }}
    </DialectHeaderData>
  )
}
// PROPTYPES
// const { string } = PropTypes
DialectHeaderContainer.propTypes = {
  //   something: string,
}

export default DialectHeaderContainer
