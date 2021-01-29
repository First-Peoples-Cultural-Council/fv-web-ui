import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary WidgetWotdPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function WidgetWotdPresentation({ entry }) {
  return <div className="WidgetWotd">{entry.title}</div>
}
// PROPTYPES
const { object } = PropTypes
WidgetWotdPresentation.propTypes = {
  entry: object,
}

export default WidgetWotdPresentation
