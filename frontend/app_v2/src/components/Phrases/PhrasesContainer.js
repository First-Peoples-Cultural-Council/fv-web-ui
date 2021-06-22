import React from 'react'
import PhrasesPresentation from 'components/Phrases/PhrasesPresentation'
import PhrasesData from 'components/Phrases/PhrasesData'

/**
 * @summary PhrasesContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function PhrasesContainer() {
  const { isLoading, items, actions, moreActions, sitename, infiniteScroll } = PhrasesData()
  return (
    <PhrasesPresentation
      actions={actions}
      isLoading={isLoading}
      items={items}
      moreActions={moreActions}
      sitename={sitename}
      infiniteScroll={infiniteScroll}
    />
  )
}

export default PhrasesContainer
