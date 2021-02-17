import React from 'react'
// import PropTypes from 'prop-types'
import useGetSections from 'common/useGetSections'
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
  const { isLoading, error, data } = HomeData()
  const { title, uid, path, logoUrl } = useGetSections()
  return (
    <HomePresentation
      isLoading={isLoading}
      error={error}
      data={data}
      language={{
        title,
        uid,
        path,
        logoUrl,
      }}
    />
  )
}
// PROPTYPES
// const { string } = PropTypes
HomeContainer.propTypes = {
  //   something: string,
}

export default HomeContainer
