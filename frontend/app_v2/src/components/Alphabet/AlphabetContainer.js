import React from 'react'
import PropTypes from 'prop-types'

import AlphabetPresentation from 'components/Alphabet/AlphabetPresentation'
import AlphabetData from 'components/Alphabet/AlphabetData'
import AlphabetPresentationWidget from 'components/Alphabet/AlphabetPresentationWidget'

/**
 * @summary AlphabetContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function AlphabetContainer({ widgetView }) {
  const {
    characters,
    error,
    isLoading,
    sitename,
    links,
    onCharacterClick,
    selectedData,
    onVideoClick,
    videoIsOpen,
  } = AlphabetData()
  return widgetView ? (
    <AlphabetPresentationWidget
      isLoading={isLoading}
      error={error}
      characters={characters}
      onCharacterClick={onCharacterClick}
      selectedData={selectedData}
      links={links}
      onVideoClick={onVideoClick}
      videoIsOpen={videoIsOpen}
    />
  ) : (
    <AlphabetPresentation
      isLoading={isLoading}
      error={error}
      characters={characters}
      sitename={sitename}
      selectedData={selectedData}
      links={links}
      onVideoClick={onVideoClick}
      videoIsOpen={videoIsOpen}
    />
  )
}

const { bool } = PropTypes

AlphabetContainer.propTypes = {
  widgetView: bool,
}

AlphabetContainer.defaultProps = {
  widgetView: false,
}

export default AlphabetContainer
