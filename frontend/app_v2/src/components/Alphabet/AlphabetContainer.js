import React from 'react'
import AlphabetPresentation from 'components/Alphabet/AlphabetPresentation'
import AlphabetData from 'components/Alphabet/AlphabetData'

/**
 * @summary AlphabetContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function AlphabetContainer() {
  const { isLoading, error, characters, language, selectedData, onVideoClick, links, videoIsOpen } = AlphabetData()
  return (
    <AlphabetPresentation
      isLoading={isLoading}
      error={error}
      characters={characters}
      language={language}
      selectedData={selectedData}
      links={links}
      onVideoClick={onVideoClick}
      videoIsOpen={videoIsOpen}
    />
  )
}

export default AlphabetContainer
