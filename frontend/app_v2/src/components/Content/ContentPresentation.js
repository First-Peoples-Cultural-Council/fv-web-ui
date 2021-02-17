import React from 'react'
import PropTypes from 'prop-types'

/**
 * @summary ContentPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ContentPresentation({ heading, body }) {
  return (
    <div className="flex justify-center">
      <section className="max-w-screen-xl py-14 px-24">
        <h1
          className={`
          border-b
          border-gray-500
          font-bold
          mb-10
          pb-5
          text-5xl
          text-fv-blue
      `}
        >
          {heading}
        </h1>
        <div className="prose-xl">{body}</div>
      </section>
    </div>
  )
}
// PROPTYPES
const { node } = PropTypes
ContentPresentation.propTypes = {
  /** Heading will be wrapped in an H1 tag */
  heading: node,
  /** Body is meant to be used with WYSIWYG markup */
  body: node,
}

export default ContentPresentation
