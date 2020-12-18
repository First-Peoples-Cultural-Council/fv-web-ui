import React from 'react'
import './IconBook.css'
/**
 * @summary IconBook
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function IconBook() {
  return (
    <svg className="IconBook" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 34">
      <g transform="translate(-0.131 -0.296)">
        <ellipse className="IconBook__bg" cx="17.5" cy="17" rx="17.5" ry="17" transform="translate(0.131 0.296)" />
        <g transform="translate(9.603 10.645)">
          <path
            className="IconBook__fg"
            d="M3,4.5H7.628a3.086,3.086,0,0,1,3.086,3.086v10.8A2.314,2.314,0,0,0,8.4,16.071H3Z"
            transform="translate(-3 -4.5)"
          />
          <path
            className="IconBook__fg"
            d="M25.714,4.5H21.086A3.086,3.086,0,0,0,18,7.586v10.8a2.314,2.314,0,0,1,2.314-2.314h5.4Z"
            transform="translate(-10.286 -4.5)"
          />
        </g>
      </g>
    </svg>
  )
}

export default IconBook
