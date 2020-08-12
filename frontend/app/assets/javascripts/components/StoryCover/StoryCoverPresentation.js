import React from 'react'
import PropTypes from 'prop-types'
import { StoryCoverStyles } from './StoryCoverStyles'
/**
 * @summary StoryCoverPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function StoryCoverPresentation({ content }) {
  const classes = StoryCoverStyles()
  return <div className={classes.base}>StoryCoverPresentation{content}</div>
}
// PROPTYPES
const { string } = PropTypes
StoryCoverPresentation.propTypes = {
  content: string,
}

export default StoryCoverPresentation
