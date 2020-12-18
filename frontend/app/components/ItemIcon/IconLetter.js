import React from 'react'
import './IconLetter.css'
/**
 * @summary IconLetter
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function IconLetter() {
  return (
    <svg className="IconLetter" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 36">
      <g transform="translate(-0.175 0.344)">
        <ellipse className="IconLetter__bg" cx="17" cy="18" rx="17" ry="18" transform="translate(0.175 -0.344)" />
        <text className="IconLetter__text" transform="translate(8.175 20.656)">
          <tspan x="0" y="0">
            Aa
          </tspan>
        </text>
      </g>
    </svg>
  )
}

export default IconLetter
