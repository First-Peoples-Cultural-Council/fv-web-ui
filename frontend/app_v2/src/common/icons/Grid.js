import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary Grid
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function Grid({ styling }) {
  return (
    <svg className={styling} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" stroke="currentColor">
      <title>Grid</title>
      <path d="M40.5,55 C42.9852814,55 45,57.0147186 45,59.5 L45,90.5 C45,92.9852814 42.9852814,95 40.5,95 L9.5,95 C7.01471863,95 5,92.9852814 5,90.5 L5,59.5 C5,57.0147186 7.01471863,55 9.5,55 L40.5,55 Z M90.5,55 C92.9852814,55 95,57.0147186 95,59.5 L95,90.5 C95,92.9852814 92.9852814,95 90.5,95 L59.5,95 C57.0147186,95 55,92.9852814 55,90.5 L55,59.5 C55,57.0147186 57.0147186,55 59.5,55 L90.5,55 Z M40.5,5 C42.9852814,5 45,7.01471863 45,9.5 L45,40.5 C45,42.9852814 42.9852814,45 40.5,45 L9.5,45 C7.01471863,45 5,42.9852814 5,40.5 L5,9.5 C5,7.01471863 7.01471863,5 9.5,5 L40.5,5 Z M90.5,5 C92.9852814,5 95,7.01471863 95,9.5 L95,40.5 C95,42.9852814 92.9852814,45 90.5,45 L59.5,45 C57.0147186,45 55,42.9852814 55,40.5 L55,9.5 C55,7.01471863 57.0147186,5 59.5,5 L90.5,5 Z" />
    </svg>
  )
}
// PROPTYPES
const { string } = PropTypes
Grid.propTypes = {
  styling: string,
}

export default Grid
