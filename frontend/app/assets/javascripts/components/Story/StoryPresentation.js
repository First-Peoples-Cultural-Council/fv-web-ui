import React from 'react'
import PropTypes from 'prop-types'

//FPCC
import { StoryStyles } from './StoryStyles'
// import StoryCover from 'components/StoryCover'
// import StoryPage from 'components/StoryPage'

/**
 * @summary StoryPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function StoryPresentation() {
  const classes = StoryStyles()
  return <div className={classes.base}>StoryPresentation</div>
}
// PROPTYPES
const { object } = PropTypes
StoryPresentation.propTypes = {
  bookEntries: object,
}

export default StoryPresentation
