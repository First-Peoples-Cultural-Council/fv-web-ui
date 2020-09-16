import React from 'react'
import '!style-loader!css-loader!./IconChat.css'
/**
 * @summary IconChat
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function IconChat() {
  return (
    <svg className="IconChat" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 34">
      <g transform="translate(-0.131 0.109)">
        <circle className="IconChat__bg" cx="17" cy="17" r="17" transform="translate(0.131 -0.109)" />
        <path
          className="IconChat__fg"
          d="M15.614,3H4.4A1.406,1.406,0,0,0,3,4.4V17.016l2.8-2.8h9.811a1.406,1.406,0,0,0,1.4-1.4V4.4A1.406,1.406,0,0,0,15.614,3Z"
          transform="translate(7.136 7.455)"
        />
      </g>
    </svg>
  )
}

export default IconChat
