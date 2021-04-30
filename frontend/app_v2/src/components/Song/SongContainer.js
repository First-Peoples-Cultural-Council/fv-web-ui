import React from 'react'
// import PropTypes from 'prop-types'
import SongPresentation from 'components/Song/SongPresentation'
import SongData from 'components/Song/SongData'

/**
 * @summary SongContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function SongContainer() {
  const { exampleOutput } = SongData({ exampleInput: 'passedInToData' })
  return <SongPresentation exampleProp={exampleOutput} />
}
// PROPTYPES
// const { string } = PropTypes
SongContainer.propTypes = {
  //   something: string,
}

export default SongContainer
