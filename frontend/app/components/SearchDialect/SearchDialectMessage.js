import React from 'react'
import PropTypes from 'prop-types'

import {
  SEARCH_PART_OF_SPEECH_ANY,
  SEARCH_DATA_TYPE_PHRASE,
  SEARCH_DATA_TYPE_WORD,
  SEARCH_TYPE_DEFAULT_SEARCH,
  SEARCH_TYPE_APPROXIMATE_SEARCH,
  SEARCH_TYPE_EXACT_SEARCH,
  SEARCH_TYPE_CONTAINS_SEARCH,
  SEARCH_TYPE_STARTS_WITH_SEARCH,
  SEARCH_TYPE_ENDS_WITH_SEARCH,
  SEARCH_TYPE_WILDCARD_SEARCH,
} from 'common/Constants'

/**
 * @summary SearchDialectPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
// Generates the 'You are searching ...' message
// ------------------------------------------------------------
export const SearchDialectMessage = ({
  category,
  dialectClassName,
  letter,
  partOfSpeech,
  phraseBook,
  searchDialectDataType,
  searchStyle,
  searchTerm,
  shouldSearchCulturalNotes,
  shouldSearchDefinitions,
  shouldSearchLiteralTranslations,
  shouldSearchTitle,
}) => {
  const cols = []
  if (shouldSearchTitle) {
    switch (searchDialectDataType) {
      case SEARCH_DATA_TYPE_WORD:
        cols.push('Word')
        break
      case SEARCH_DATA_TYPE_PHRASE:
        cols.push('Phrase')
        break
      default:
        cols.push('Item')
    }
  }
  if (shouldSearchDefinitions) {
    cols.push('Definitions')
  }
  if (shouldSearchCulturalNotes) {
    cols.push('Cultural notes')
  }
  if (shouldSearchLiteralTranslations) {
    cols.push('Literal translations')
  }

  let dataType
  switch (searchDialectDataType) {
    case SEARCH_DATA_TYPE_WORD:
      dataType = 'words'
      break
    case SEARCH_DATA_TYPE_PHRASE:
      dataType = 'phrases'
      break
    default:
      dataType = 'items'
  }

  let searchStyleLabel

  switch (searchStyle) {
    case SEARCH_TYPE_DEFAULT_SEARCH:
      searchStyleLabel = ' match '
      break
    case SEARCH_TYPE_APPROXIMATE_SEARCH:
      searchStyleLabel = ' approximately match '
      break
    case SEARCH_TYPE_EXACT_SEARCH:
      searchStyleLabel = ' exactly match '
      break
    case SEARCH_TYPE_CONTAINS_SEARCH:
      searchStyleLabel = ' contain '
      break
    case SEARCH_TYPE_STARTS_WITH_SEARCH:
      searchStyleLabel = ' start with '
      break
    case SEARCH_TYPE_ENDS_WITH_SEARCH:
      searchStyleLabel = ' end with '
      break
    case SEARCH_TYPE_WILDCARD_SEARCH:
      searchStyleLabel = ' pattern match '
      break
    default:
      searchStyleLabel = ' contain '
  }

  const searchTermTag = <strong className={dialectClassName}>{searchTerm}</strong>
  const searchStyleTag = <strong>{searchStyleLabel}</strong>
  const messagePartsOfSpeech =
    partOfSpeech && partOfSpeech !== SEARCH_PART_OF_SPEECH_ANY ? ", filtered by the selected 'Parts of speech'" : ''

  const messages = {
    // `all` is defined later
    byCategory: <span>{`Showing all ${dataType} in the selected category${messagePartsOfSpeech}`}</span>,
    byPhraseBook: <span>{`Showing all ${dataType} from the selected Phrase Book${messagePartsOfSpeech}`}</span>,
    startWith: (
      <span>
        {`Showing ${dataType} that start with the letter '`}
        <strong className={dialectClassName}>{letter}</strong>
        {`'${messagePartsOfSpeech}`}
      </span>
    ),
    contain: (
      <span>
        {`Showing ${dataType} that contain the search term '`}
        {searchTermTag}
        {`'${messagePartsOfSpeech}`}
      </span>
    ),
    containColOne: (
      <span>
        {`Showing ${dataType} that `}
        {searchStyleTag}
        {" the search term '"}
        {searchTermTag}
        {`' in the '${cols[0]}' column${messagePartsOfSpeech}`}
      </span>
    ),
    containColsTwo: (
      <span>
        {`Showing ${dataType} that `}
        {searchStyleTag}
        {" the search term '"}
        {searchTermTag}
        {`' in the '${cols[0]}' and '${cols[1]}' columns${messagePartsOfSpeech}`}
      </span>
    ),
    containColsThree: (
      <span>
        {`Showing ${dataType} that `}
        {searchStyleTag}
        {" the search term '"}
        {searchTermTag}
        {`' in the '${cols[0]}', '${cols[1]}', and '${cols[2]}' columns${messagePartsOfSpeech}`}
      </span>
    ),
  }

  switch (searchDialectDataType) {
    case SEARCH_DATA_TYPE_WORD:
      messages.all = (
        <span>{`Showing all ${dataType} in the dictionary listed alphabetically${messagePartsOfSpeech}`}</span>
      )
      break
    case SEARCH_DATA_TYPE_PHRASE:
      messages.all = <span>{`Showing all ${dataType} listed alphabetically${messagePartsOfSpeech}`}</span>
      break
    default:
      messages.all = <span>{`Showing all ${dataType} listed alphabetically${messagePartsOfSpeech}`}</span>
  }

  let msg = messages.all

  if (
    partOfSpeech !== true &&
    shouldSearchTitle !== true &&
    shouldSearchDefinitions !== true &&
    shouldSearchCulturalNotes !== true &&
    shouldSearchLiteralTranslations !== true
  ) {
    return <div className="SearchDialectSearchFeedback alert alert-info">{msg}</div>
  }

  if (letter) {
    msg = messages.startWith
  } else if (category) {
    msg = messages.byCategory
  } else if (phraseBook) {
    msg = messages.byPhraseBook
  } else if (!searchTerm || searchTerm === '') {
    msg = messages.all
  } else {
    msg = messages.contain

    if (cols.length === 1) {
      msg = messages.containColOne
    }

    if (cols.length === 2) {
      msg = messages.containColsTwo
    }

    if (cols.length >= 3) {
      msg = messages.containColsThree
    }
  }
  return <div className="SearchDialectSearchFeedback alert alert-info">{msg}</div>
}
// PROPTYPES
const { bool, number, string } = PropTypes
SearchDialectMessage.propTypes = {
  category: string,
  dialectClassName: string,
  letter: string,
  partOfSpeech: string,
  phraseBook: string,
  searchDialectDataType: number,
  searchStyle: string,
  searchTerm: string,
  shouldSearchCulturalNotes: bool,
  shouldSearchDefinitions: bool,
  shouldSearchLiteralTranslations: bool,
  shouldSearchTitle: bool,
}
export default SearchDialectMessage
