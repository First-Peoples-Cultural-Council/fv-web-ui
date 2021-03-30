import React from 'react'
import PropTypes from 'prop-types'

/**
 * @summary KidsPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function KidsPresentation({ heading, body }) {
  return (
    <div className="flex justify-center">
      <section className="max-w-screen-xl py-4 px-4 lg:py-14 lg:px-24">
        <h1 className="border-b border-gray-500 font-bold mb-5 pb-5 text-5xl text-fv-blue">{heading}</h1>
        <div className="prose-xl">{body}</div>
      </section>
    </div>
  )
}
// PROPTYPES
const { node } = PropTypes
KidsPresentation.propTypes = {
  /** Heading will be wrapped in an H1 tag */
  heading: node,
  /** Body is meant to be used with WYSIWYG markup */
  body: node,
}

export default KidsPresentation
