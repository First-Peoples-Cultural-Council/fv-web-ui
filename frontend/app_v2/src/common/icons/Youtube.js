import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary Youtube Icon
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function Youtube({ styling }) {
  return (
    <svg
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      clipRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      fill="none"
      stroke="currentColor"
      className={styling}
    >
      <title>Follow on Youtube</title>
      <path d="M449.446,0c34.525,0 62.554,28.03 62.554,62.554l0,386.892c0,34.524 -28.03,62.554 -62.554,62.554l-386.892,0c-34.524,0 -62.554,-28.03 -62.554,-62.554l0,-386.892c0,-34.524 28.029,-62.554 62.554,-62.554l386.892,0Zm-20.967,175.63c-4.139,-15.489 -16.337,-27.687 -31.826,-31.826c-28.078,-7.524 -140.653,-7.524 -140.653,-7.524c0,0 -112.575,0 -140.653,7.524c-15.486,4.139 -27.686,16.337 -31.826,31.826c-7.521,28.075 -7.521,86.652 -7.521,86.652c0,0 0,58.576 7.521,86.648c4.14,15.489 16.34,27.69 31.826,31.829c28.078,7.521 140.653,7.521 140.653,7.521c0,0 112.575,0 140.653,-7.521c15.489,-4.139 27.687,-16.34 31.826,-31.829c7.521,-28.072 7.521,-86.648 7.521,-86.648c0,0 0,-58.577 -7.521,-86.652Zm-208.481,140.653l0,-108.002l93.53,54.001l-93.53,54.001Z" />
    </svg>
  )
}
// PROPTYPES
const { string } = PropTypes
Youtube.propTypes = {
  styling: string,
}

export default Youtube
