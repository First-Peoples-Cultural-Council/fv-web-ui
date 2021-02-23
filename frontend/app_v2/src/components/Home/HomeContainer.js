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
  const { isLoading, error, data, language, dataOriginal, isWorkspaceOn } = HomeData()
  return (
    <HomePresentation
      isWorkspaceOn={isWorkspaceOn}
      isLoading={isLoading}
      error={error}
      data={data}
      dataOriginal={dataOriginal}
      language={language}
    />
  )
}
// PROPTYPES
// const { string } = PropTypes
HomeContainer.propTypes = {
  //   something: string,
}

export default HomeContainer
