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
  const { isLoading, error, data, language, selectedData } = AlphabetData()
  return (
    <AlphabetPresentation
      isLoading={isLoading}
      error={error}
      data={data}
      language={language}
      selectedData={selectedData}
    />
  )
}

export default AlphabetContainer
