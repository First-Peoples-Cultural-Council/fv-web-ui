import React from 'react'
// import PropTypes from 'prop-types'
import GamePresentation from 'components/Game/GamePresentation'
import GameData from 'components/Game/GameData'

/**
 * @summary GameContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function GameContainer() {
  const { exampleOutput } = GameData({ exampleInput: 'passedInToData' })
  return <GamePresentation exampleProp={exampleOutput} />
}
// PROPTYPES
// const { string } = PropTypes
GameContainer.propTypes = {
  //   something: string,
}

export default GameContainer
