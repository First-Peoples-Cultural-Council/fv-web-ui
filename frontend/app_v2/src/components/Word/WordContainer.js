import React from 'react'
import WordData from 'components/Word/WordData'
// FROM V1!
import WordContainerV1 from 'app_v1/WordContainer'
/**
 * @summary WordContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function WordContainer() {
  const { hasSectionData, wordId } = WordData()
  // Wait for getSections call to finish before we render WordContainerV1
  return hasSectionData && wordId ? <WordContainerV1 wordId={wordId} /> : <div>waiting</div>
}

export default WordContainer
