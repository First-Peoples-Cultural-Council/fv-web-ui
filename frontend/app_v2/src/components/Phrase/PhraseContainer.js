import React from 'react'
import PhraseData from 'components/Phrase/PhraseData'
import DictionaryDetail from 'components/DictionaryDetail'
import Loading from 'components/Loading'
/**
 * @summary PhraseContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function PhraseContainer({ docId }) {
  const { actions, entry, isLoading, moreActions, sitename } = PhraseData({ docId })
  return (
    <Loading.Container isLoading={isLoading}>
      <DictionaryDetail.Presentation actions={actions} entry={entry} moreActions={moreActions} sitename={sitename} />
    </Loading.Container>
  )
}

export default PhraseContainer
