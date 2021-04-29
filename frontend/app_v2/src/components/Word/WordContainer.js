import React from 'react'
import WordData from 'components/Word/WordData'
import WordPresentation from 'components/Word/WordPresentation'
import Loading from 'components/Loading'
/**
 * @summary WordContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function WordContainer() {
  const { actions, entry, isLoading, moreActions } = WordData()
  return (
    <Loading.Container isLoading={isLoading}>
      <WordPresentation actions={actions} entry={entry} moreActions={moreActions} />
    </Loading.Container>
  )
}

export default WordContainer
