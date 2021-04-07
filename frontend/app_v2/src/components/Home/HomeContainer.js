import React from 'react'
// import PropTypes from 'prop-types'
import HomePresentation from 'components/Home/HomePresentation'
import HomeData from 'components/Home/HomeData'
import Loading from 'components/Loading'

/**
 * @summary HomeContainer
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function HomeContainer() {
  const { isLoading, data, language } = HomeData()
  return (
    <Loading.Container isLoading={isLoading}>
      <HomePresentation data={data} language={language} />
    </Loading.Container>
  )
}

export default HomeContainer
