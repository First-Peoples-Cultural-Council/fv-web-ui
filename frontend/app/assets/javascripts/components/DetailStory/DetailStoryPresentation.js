import React from 'react'
import PropTypes from 'prop-types'
import { DetailStoryStyles } from './DetailStoryStyles'
/**
 * @summary DetailStoryPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function DetailStoryPresentation({ content }) {
  const classes = DetailStoryStyles()
  return <div className={classes.base}>DetailStoryPresentation{content}</div>
}
// PROPTYPES
const { string } = PropTypes
DetailStoryPresentation.propTypes = {
  content: string,
}

export default DetailStoryPresentation
