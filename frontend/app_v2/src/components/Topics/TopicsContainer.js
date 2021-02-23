import React from 'react'
import TopicsPresentation from 'components/Topics/TopicsPresentation'
import TopicsData from 'components/Topics/TopicsData'

/**
 * @summary TopicsContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function TopicsContainer() {
  const { topics } = TopicsData()
  return <TopicsPresentation topics={topics} />
}

export default TopicsContainer
