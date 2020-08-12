import React from 'react'
import PropTypes from 'prop-types'
import { StoryStyles } from './StoryStyles'
/**
 * @summary StoryPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function StoryPresentation({ content }) {
  const classes = StoryStyles()
  return <div className={classes.base}>StoryPresentation{content}</div>
}
// PROPTYPES
const { string } = PropTypes
StoryPresentation.propTypes = {
  content: string,
}

export default StoryPresentation
