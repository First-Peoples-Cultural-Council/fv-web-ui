import React from 'react'
import '!style-loader!css-loader!./IconGenericItem.css'
/**
 * @summary IconGenericItem
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function IconGenericItem() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="IconGenericItem" viewBox="0 0 59 59">
      <g transform="translate(0.151 0.14)">
        <path
          className="IconGenericItem__bg"
          d="M29.5,0A29.5,29.5,0,1,1,0,29.5,29.5,29.5,0,0,1,29.5,0Z"
          transform="translate(-0.152 -0.14)"
        />
        <path
          className="IconGenericItem__fg"
          d="M13.395,4.7l1.561-1.561a1.681,1.681,0,0,1,2.384,0L31.008,16.8a1.681,1.681,0,0,1,0,2.384L17.339,32.857a1.681,1.681,0,0,1-2.384,0L13.395,31.3a1.689,1.689,0,0,1,.028-2.412L21.9,20.813H1.688A1.683,1.683,0,0,1,0,19.125v-2.25a1.683,1.683,0,0,1,1.688-1.687H21.9L13.423,7.116A1.677,1.677,0,0,1,13.395,4.7Z"
          transform="translate(13.848 11.213)"
        />
      </g>
    </svg>
  )
}

export default IconGenericItem
