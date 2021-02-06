import React from 'react'
// import PropTypes from 'prop-types'
import HomePresentation from 'components/Home/HomePresentation'
import HomeData from 'components/Home/HomeData'

/**
 * @summary HomeContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function HomeContainer() {
  const { isLoading, error, data, dataOriginal } = HomeData()
  return <HomePresentation isLoading={isLoading} error={error} data={data} dataOriginal={dataOriginal} />
}
// PROPTYPES
// const { string } = PropTypes
HomeContainer.propTypes = {
  //   something: string,
}

export default HomeContainer
