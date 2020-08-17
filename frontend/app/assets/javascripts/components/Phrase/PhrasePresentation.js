import React from 'react'
// import PropTypes from 'prop-types'
import { PhraseStyles } from './PhraseStyles.js'
/**
 * @summary PhrasePresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function PhrasePresentation() {
  const classes = PhraseStyles()
  return <div className={classes.base}>PhrasePresentation</div>
}
// PROPTYPES
// const { string } = PropTypes
PhrasePresentation.propTypes = {
  //   something: string,
}

export default PhrasePresentation
