import React from 'react'
import DictionaryPresentation from 'components/Dictionary/DictionaryPresentation'
import DictionaryData from 'components/Dictionary/DictionaryData'

/**
 * @summary DictionaryContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function DictionaryContainer() {
  const { isLoading, items, actions, moreActions, sitename, infiniteScroll } = DictionaryData()
  return (
    <DictionaryPresentation
      actions={actions}
      isLoading={isLoading}
      items={items}
      moreActions={moreActions}
      sitename={sitename}
      infiniteScroll={infiniteScroll}
    />
  )
}

export default DictionaryContainer
