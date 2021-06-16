import React from 'react'
import PropTypes from 'prop-types'
import TopicsPresentationTopic from 'components/Topics/TopicsPresentationTopic'
/**
 * @summary TopicsPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function TopicsPresentation({ title, topics }) {
  return (
    <section className="Topics bg-white py-6 mx-10">
      <div className="relative mx-10">
        <h2 className="mb-12 relative z-10 text-center text-4xl text-primary font-bold sm:text-5xl">
          <span className="inline-block px-4 sm:px-8 lg:px-20 bg-white">{title}</span>
        </h2>
        <hr className="absolute z-0 w-full" style={{ top: '50%' }} />
      </div>
      <div className="grid gap-y-5 gap-x-8 md:gap-y-10 md:gap-x-14 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr">
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
    </section>
  )
}
// PROPTYPES
const { array, string } = PropTypes
TopicsPresentation.propTypes = {
  topics: array,
  title: string,
}

export default TopicsPresentation
