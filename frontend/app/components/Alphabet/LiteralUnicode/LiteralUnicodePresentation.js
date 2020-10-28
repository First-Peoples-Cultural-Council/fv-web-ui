import React from 'react'
import PropTypes from 'prop-types'
const LiteralUnicodePresentation = (props) => {
  const { className, literalUnicode } = props
  return (
    <div className={`${className ? className : ''}`}>
      <h3>Unicode String Literal:</h3>
      <code>{literalUnicode}</code>
    </div>
  )
}

const { string } = PropTypes
LiteralUnicodePresentation.propTypes = {
  className: string,
  literalUnicode: string.isRequired,
}

export default LiteralUnicodePresentation
