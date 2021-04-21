import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary PhrasePresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function PhrasePresentation({ phraseId }) {
  return <div className="Phrase">PhrasePresentation: {phraseId}</div>
}
// PROPTYPES
const { string } = PropTypes
PhrasePresentation.propTypes = {
  phraseId: string,
}

export default PhrasePresentation
