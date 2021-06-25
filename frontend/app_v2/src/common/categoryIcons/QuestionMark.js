import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary QuestionMark
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function QuestionMark({ styling }) {
  return (
    <svg className={styling} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" stroke="currentColor">
      <title>QuestionMark</title>
      <path d="M0 24C0-7 58-9 58 23c0 19-19 18-23 36-2 9-14 8-14-2 0-17 14-18 20-29 4-8-3-16-11-16-17 0-11 19-22 19-4 0-8-3-8-7zm28 64c-12 0-11-18 0-18 12 0 12 18 0 18z" />
    </svg>
  )
}
// PROPTYPES
const { string } = PropTypes
QuestionMark.propTypes = {
  styling: string,
}

export default QuestionMark
