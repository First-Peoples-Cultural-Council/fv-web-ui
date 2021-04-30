import React from 'react'
// import PropTypes from 'prop-types'
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
  const { exampleOutput } = PhrasesData({ exampleInput: 'passedInToData' })
  return <PhrasesPresentation exampleProp={exampleOutput} />
}
// PROPTYPES
// const { string } = PropTypes
PhrasesContainer.propTypes = {
  //   something: string,
}

export default PhrasesContainer
