import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary Home
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function Home({ styling }) {
  return (
    <svg
      className={styling}
      height="100px"
      width="100px"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 100 100"
    >
      <polygon points="5,53.75 20,53.75 20,91.249 42.667,91.249 42.667,67.396 57.333,67.396 57.333,91.249 79.999,91.249 79.999,53.75   95,53.75 49.998,8.751 " />
    </svg>
  )
}
// PROPTYPES
const { string } = PropTypes
Home.propTypes = {
  styling: string,
}

export default Home
