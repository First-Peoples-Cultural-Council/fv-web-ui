import React from 'react'
import PhraseData from 'components/Phrase/PhraseData'
// FROM V1!
import WordContainerV1 from 'app_v1/WordContainer'
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
  return hasSiteData && phraseId ? <WordContainerV1 wordId={phraseId} /> : <div>waiting</div>
}

export default PhraseContainer
