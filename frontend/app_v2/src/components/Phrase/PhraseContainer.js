import React from 'react'
import PropTypes from 'prop-types'
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
function PhraseContainer({ docId, isDrawer }) {
  const { actions, entry, isLoading, moreActions, sitename } = PhraseData({ docId })
  return (
    <Loading.Container isLoading={isLoading}>
      {isDrawer ? (
        <DictionaryDetail.PresentationDrawer
          actions={actions}
          entry={entry}
          moreActions={moreActions}
          sitename={sitename}
        />
      ) : (
        <DictionaryDetail.Presentation actions={actions} entry={entry} moreActions={moreActions} sitename={sitename} />
      )}
    </Loading.Container>
  )
}

// PROPTYPES
const { bool, string } = PropTypes
PhraseContainer.propTypes = {
  docId: string,
  isDrawer: bool,
}

export default PhraseContainer
