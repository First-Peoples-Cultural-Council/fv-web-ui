import React from 'react'
// import PropTypes from 'prop-types'
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
  const { exampleOutput } = WordsData({ exampleInput: 'passedInToData' })
  return <WordsPresentation exampleProp={exampleOutput} />
}
// PROPTYPES
// const { string } = PropTypes
WordsContainer.propTypes = {
  //   something: string,
}

export default WordsContainer
