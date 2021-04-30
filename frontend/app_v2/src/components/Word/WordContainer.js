import React from 'react'
import WordData from 'components/Word/WordData'
import WordPresentation from 'components/Word/WordPresentation'
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

  return hasSiteData && wordId ? <WordPresentation wordId={wordId} /> : <div>waiting</div>
}

export default WordContainer
