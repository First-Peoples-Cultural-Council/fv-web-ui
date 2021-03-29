import React from 'react'
// import PropTypes from 'prop-types'
import SongsPresentation from 'components/Songs/SongsPresentation'
import SongsData from 'components/Songs/SongsData'

/**
 * @summary SongsContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function SongsContainer() {
  const { exampleOutput } = SongsData({ exampleInput: 'passedInToData' })
  return <SongsPresentation exampleProp={exampleOutput} />
}
// PROPTYPES
// const { string } = PropTypes
SongsContainer.propTypes = {
  //   something: string,
}

export default SongsContainer
