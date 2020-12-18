import React from 'react'
import './IconMusic.css'
/**
 * @summary IconMusic
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function IconMusic() {
  return (
    <svg className="IconMusic" xmlns="http://www.w3.org/2000/svg" width="35" height="34" viewBox="0 0 35 34">
      <g transform="translate(-0.175 -0.476)">
        <ellipse className="IconMusic__bg" cx="17.5" cy="17" rx="17.5" ry="17" transform="translate(0.175 0.476)" />
        <path
          className="IconMusic__fg"
          d="M15.379.961a.961.961,0,0,0-1.25-.916L4.518,2.883a.961.961,0,0,0-.673.916v7.852a4.155,4.155,0,0,0-.961-.118C1.291,11.534,0,12.394,0,13.456s1.291,1.922,2.884,1.922,2.884-.861,2.884-1.922V6.437l7.69-2.253V9.729a4.155,4.155,0,0,0-.961-.118c-1.593,0-2.884.861-2.884,1.922S10.9,13.456,12.5,13.456s2.884-.861,2.884-1.922V.961Z"
          transform="translate(8.206 9.774)"
        />
      </g>
    </svg>
  )
}

export default IconMusic
