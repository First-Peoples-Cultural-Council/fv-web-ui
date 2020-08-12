import React from 'react'
import PropTypes from 'prop-types'
import { StoryPageStyles } from './StoryPageStyles'
/**
 * @summary StoryPagePresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function StoryPagePresentation({ content }) {
  const classes = StoryPageStyles()
  return <div className={classes.base}>StoryPagePresentation{content}</div>
}
// PROPTYPES
const { string } = PropTypes
StoryPagePresentation.propTypes = {
  content: string,
}

export default StoryPagePresentation
