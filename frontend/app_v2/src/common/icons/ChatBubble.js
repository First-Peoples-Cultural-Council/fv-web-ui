import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary ChatBubble
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ChatBubble({ styling }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className={styling}>
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
    </svg>
  )
}
// PROPTYPES
const { string } = PropTypes
ChatBubble.propTypes = {
  styling: string,
}

export default ChatBubble
