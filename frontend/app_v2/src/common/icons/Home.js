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
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className={styling}>
      <title>Home</title>
      <g data-name="Home 02">
        <path d="M22.835,13.128l-10-9a.5.5,0,0,0-.67,0l-10,9A.5.5,0,0,0,2.5,14H5v6.5a.5.5,0,0,0,.5.5h5a.5.5,0,0,0,.5-.5V16h3v4.5a.5.5,0,0,0,.5.5h5a.5.5,0,0,0,.5-.5V14h2.5a.5.5,0,0,0,.335-.872ZM19.5,13a.5.5,0,0,0-.5.5V20H15V15.5a.5.5,0,0,0-.5-.5h-4a.5.5,0,0,0-.5.5V20H6V13.5a.5.5,0,0,0-.5-.5H3.8l8.7-7.827L21.2,13Z" />
      </g>
    </svg>
  )
}
// PROPTYPES
const { string } = PropTypes
Home.propTypes = {
  styling: string,
}

export default Home
