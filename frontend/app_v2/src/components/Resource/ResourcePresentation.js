import React from 'react'
import PropTypes from 'prop-types'
/**
 * @summary ResourcePresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function ResourcePresentation({ body, bannerHeading }) {
  return (
    <div>
      <div className="bg-fv-turquoise m-4 p-10 text-white lg:my-4 lg:mx-24 max-w-screen-xl">
        <h1 className="text-center text-2xl mb-5 font-bold">{bannerHeading}</h1>
        <p className="mb-5">
          Eiusmod reprehenderit magna laboris do non do do dolore aute ex. Duis dolore sunt non cupidatat duis cupidatat
          deserunt laboris id amet aliquip velit duis eu.
        </p>
        <span>iOS Logo</span> <span>Android Logo</span>
      </div>

      {body && (
        <div>
          {body.map(({ sectionHeading, sectionText }, index) => {
            return (
              <section key={index} className="max-w-screen-xl py-4 px-4 lg:my-16 lg:mx-24 lg:p-0 mx-auto">
                <h2 className="border-b border-gray-500 font-bold mb-5 pb-5 text-3xl text-fv-blue">{sectionHeading}</h2>
                <div className="prose-xl">{sectionText}</div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
// PROPTYPES
const { string, array } = PropTypes
ResourcePresentation.propTypes = {
  body: array,
  bannerHeading: string,
}

export default ResourcePresentation
