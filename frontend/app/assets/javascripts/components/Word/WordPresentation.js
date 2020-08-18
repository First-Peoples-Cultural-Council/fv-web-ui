import React from 'react'
// import PropTypes from 'prop-types'
import { WordStyles } from './WordStyles.js'
/**
 * @summary WordPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function WordPresentation() {
  const classes = WordStyles()
  return <div className={classes.base}>WordPresentation</div>
}
// PROPTYPES
// const { string } = PropTypes
WordPresentation.propTypes = {
  //   something: string,
}

export default WordPresentation
