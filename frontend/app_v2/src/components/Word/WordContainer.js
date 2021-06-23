import React from 'react'
import PropTypes from 'prop-types'
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
function WordContainer({ docId, isDrawer }) {
  const { actions, entry, isLoading, moreActions, sitename } = WordData({ docId })
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
WordContainer.propTypes = {
  docId: string,
  isDrawer: bool,
}

export default WordContainer
