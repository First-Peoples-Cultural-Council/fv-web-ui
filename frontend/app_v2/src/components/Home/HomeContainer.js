import React from 'react'
// import PropTypes from 'prop-types'
import HomePresentation from 'components/Home/HomePresentation'
import HomeData from 'components/Home/HomeData'

/**
 * @summary HomeContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function HomeContainer() {
  const { isLoading, error, data, language, dataOriginal } = HomeData()
  return (
    <HomePresentation isLoading={isLoading} error={error} data={data} dataOriginal={dataOriginal} language={language} />
  )
}

export default HomeContainer
