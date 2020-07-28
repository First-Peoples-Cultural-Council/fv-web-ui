import React from 'react'
import PropTypes from 'prop-types'
import '!style-loader!css-loader!./ActivityStream.css'
/**
 * @summary ActivityStreamPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ActivityStreamPresentation({ className }) {
  return (
    <div className={`ActivityStream ${className ? className : ''}`}>
      <h2>ActivityStream</h2>
      <p>Lorem ipsum dolor sit amet</p>
      <p>consectetur adipiscing elit</p>
      <p>sed do eiusmod tempor incididunt ut labore</p>
      <p>et dolore magna aliqua. Elit ut aliquam purus</p>
      <p>sit amet. Id leo in vitae turpis massa sed</p>
    </div>
  )
}
// PROPTYPES
const { string } = PropTypes
ActivityStreamPresentation.propTypes = {
  className: string,
}

export default ActivityStreamPresentation
