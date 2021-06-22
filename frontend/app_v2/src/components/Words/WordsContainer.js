import React from 'react'
import WordsPresentation from 'components/Words/WordsPresentation'
import WordsData from 'components/Words/WordsData'

/**
 * @summary WordsContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function WordsContainer() {
  const { isLoading, items, actions, moreActions, sitename, infiniteScroll } = WordsData()
  return (
    <WordsPresentation
      actions={actions}
      isLoading={isLoading}
      items={items}
      moreActions={moreActions}
      sitename={sitename}
      infiniteScroll={infiniteScroll}
    />
  )
}

export default WordsContainer
