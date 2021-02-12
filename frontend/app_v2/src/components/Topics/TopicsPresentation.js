import React from 'react'
import PropTypes from 'prop-types'
import TopicsPresentationTopic from 'components/Topics/TopicsPresentationTopic'
/**
 * @summary TopicsPresentation
 * @version 1.0.0
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function TopicsPresentation({ title, topics }) {
  return (
    <div className="Topics bg-white py-8">
      <div className="relative">
        <h2 className="mb-12 relative z-10 text-center text-4xl text-fv-blue font-bold uppercase sm:text-5xl">
          <span
            className={`
            inline-block
            px-4
            sm:px-8
            XXmd:px-16
            lg:px-20

            bg-white
          `}
          >
            {title}
          </span>
        </h2>
        <hr className="absolute z-0 w-full" style={{ top: '50%' }} />
      </div>
      <div
        className={`
        grid
        gap-3
        grid-cols-2
        grid-rows-3
        sm:grid-rows-2
        sm:grid-cols-3
        md:grid-cols-4
      `}
      >
        {topics.map(({ audio, heading, image, listCount, subheading, type, url }, index) => {
          const key = `topic${index}`
          return (
            <TopicsPresentationTopic
              key={key}
              audio={audio}
              heading={heading}
              image={image}
              subheading={subheading}
              url={url}
              listCount={listCount}
              type={type}
            />
          )
        })}
      </div>
    </div>
  )
}
// PROPTYPES
const { array, string } = PropTypes
TopicsPresentation.propTypes = {
  topics: array,
  title: string,
}

export default TopicsPresentation
