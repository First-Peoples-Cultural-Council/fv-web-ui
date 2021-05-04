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
function PhraseContainer() {
  const { actions, entry, isLoading, moreActions, siteShortUrl } = PhraseData()
  return (
    <Loading.Container isLoading={isLoading}>
      <DictionaryDetail.Presentation
        actions={actions}
        entry={entry}
        moreActions={moreActions}
        siteShortUrl={siteShortUrl}
      />
    </Loading.Container>
  )
}

export default PhraseContainer
