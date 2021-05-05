import React from 'react'
import WordData from 'components/Word/WordData'
import DictionaryDetail from 'components/DictionaryDetail'
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
  const { actions, entry, isLoading, moreActions, sitename } = WordData()
  return (
    <Loading.Container isLoading={isLoading}>
      <DictionaryDetail.Presentation actions={actions} entry={entry} moreActions={moreActions} sitename={sitename} />
    </Loading.Container>
  )
}

export default WordContainer
