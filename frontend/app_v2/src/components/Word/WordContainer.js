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
function WordContainer({ docId }) {
  const { actions, entry, isLoading, moreActions, sitename } = WordData({ docId })
  return (
    <Loading.Container isLoading={isLoading}>
      <DictionaryDetail.Presentation actions={actions} entry={entry} moreActions={moreActions} sitename={sitename} />
    </Loading.Container>
  )
}

// PROPTYPES
const { string } = PropTypes
WordContainer.propTypes = {
  docId: string,
}

export default WordContainer
