import React from 'react'
import '!style-loader!css-loader!./IconQuote.css'
/**
 * @summary IconQuote
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function IconQuote() {
  return (
    <svg className="IconQuote" xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35">
      <g transform="translate(-0.131 0.019)">
        <circle className="IconQuote__bg" cx="17.5" cy="17.5" r="17.5" transform="translate(0.131 -0.019)" />
        <path
          className="IconQuote__path"
          d="M8.355,13.434v3.794h3.794V13.434h-1.9a1.858,1.858,0,0,1,1.9-1.9V9.64s-3.794,0-3.794,3.794Zm9.485-1.9V9.64s-3.794,0-3.794,3.794v3.794H17.84V13.434h-1.9A1.858,1.858,0,0,1,17.84,11.537Z"
          transform="translate(-2.416 1.636)"
        />
        <path
          className="IconQuote__path"
          d="M8.238,17.879h2.214l1.476-2.952V10.5H7.5v4.427H9.714Zm5.9,0h2.214l1.476-2.952V10.5H13.4v4.427h2.214Z"
          transform="translate(10.89 4.324)"
        />
      </g>
    </svg>
  )
}

export default IconQuote
