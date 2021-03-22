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
  const { hasSiteData, wordId } = WordData()
  // Wait for getSite call to finish before we render WordContainerV1
  return hasSiteData && wordId ? <WordContainerV1 wordId={wordId} /> : <div>waiting</div>
}

export default WordContainer
