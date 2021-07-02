import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary PaintPalette
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function PaintPalette({ styling }) {
  return (
    <svg className={styling} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" stroke="currentColor">
      <title>PaintPalette</title>
      <path d="M4.5 49.1c-.2 12.1 4.4 23.6 13 32.4 8.8 8.9 20.9 14.1 33.4 14.1h.4c5.7 0 10.4-4.7 10.4-10.4S57 74.7 51.3 74.7c-3.6 0-6.5-2.9-6.5-6.5 0-1.3.4-2.6 1.1-3.6 1.4-2.1 4.3-3.1 7-2.4l.3.1c2.4.6 4.4 2.4 5.5 4.9 1.9 4.6 6.4 7.6 11.4 7.6 13.8 0 25-11 25.4-24.7v-.7C95.2 24.5 74.9 4.5 50 4.5c-24.6 0-45.1 20-45.5 44.6zm22.1 2.2c0 4.3-3.5 7.8-7.8 7.8S11 55.6 11 51.3s3.5-7.8 7.8-7.8 7.8 3.5 7.8 7.8zm1.3-11.7c-4.3 0-7.8-3.5-7.8-7.8s3.5-7.8 7.8-7.8 7.8 3.5 7.8 7.8-3.5 7.8-7.8 7.8zm50.7-11.7c0 4.3-3.5 7.8-7.8 7.8S63 32.2 63 27.9s3.5-7.8 7.8-7.8 7.8 3.5 7.8 7.8zm-22.1-6.5c0 4.3-3.5 7.8-7.8 7.8s-7.8-3.5-7.8-7.8 3.5-7.8 7.8-7.8 7.8 3.5 7.8 7.8z" />
    </svg>
  )
}
// PROPTYPES
const { string } = PropTypes
PaintPalette.propTypes = {
  styling: string,
}

export default PaintPalette
