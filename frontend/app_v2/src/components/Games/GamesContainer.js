import React from 'react'
// import PropTypes from 'prop-types'
import GamesPresentation from 'components/Games/GamesPresentation'
import GamesData from 'components/Games/GamesData'

/**
 * @summary GamesContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function GamesContainer() {
  const { exampleOutput } = GamesData({ exampleInput: 'passedInToData' })
  return <GamesPresentation exampleProp={exampleOutput} />
}
// PROPTYPES
// const { string } = PropTypes
GamesContainer.propTypes = {
  //   something: string,
}

export default GamesContainer
