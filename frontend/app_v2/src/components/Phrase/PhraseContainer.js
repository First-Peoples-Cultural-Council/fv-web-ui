import React from 'react'
import PhraseData from 'components/Phrase/PhraseData'
import PhrasePresentation from 'components/Phrase/PhrasePresentation'
/**
 * @summary PhraseContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function PhraseContainer() {
  const { hasSiteData, phraseId } = PhraseData()
  // Wait for getSite call to finish before we render WordContainerV1
  return hasSiteData && phraseId ? <PhrasePresentation phraseId={phraseId} /> : <div>waiting</div>
}

export default PhraseContainer
