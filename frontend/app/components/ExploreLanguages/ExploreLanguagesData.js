import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'

import useDirectory from 'dataSources/useDirectory'
import useLogin from 'dataSources/useLogin'
import usePortal from 'dataSources/usePortal'
import useRoute from 'dataSources/useRoute'

import { WORKSPACES } from 'common/Constants'

/**
 * @summary ExploreLanguagesData
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function ExploreLanguagesData({ children }) {
  const { fetchDirectory, computeDirectory } = useDirectory()
  const { computeLogin } = useLogin()
  const { fetchPortals, computePortals } = usePortal()
  const { routeParams } = useRoute()
  const isWorkspaces = routeParams.area === WORKSPACES ? true : false

  const [languageSites, setLanguageSites] = useState([])
  const [parentLanguages, setParentLanguages] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (selectn('success', computePortals)) {
      const portalsEntries = selectn('response', computePortals) || []
      const sortedPortals = portalsEntries.sort(portalEntriesSort)
      setLanguageSites(sortedPortals)
    }
  }, [computePortals])

  useEffect(() => {
    if (selectn('success', computeDirectory)) {
      const _parentLanguages = selectn('directoryEntries.parent_languages', computeDirectory) || []
      setParentLanguages(_parentLanguages)
    }
  }, [computeDirectory])

  const fetchData = () => {
    fetchPortals({ area: routeParams.area })
    fetchDirectory('parent_languages', 2000, true)
  }

  const portalEntriesSort = (a, b) => {
    const a2 = selectn('contextParameters.lightancestry.dialect.dc:title', a)
    const b2 = selectn('contextParameters.lightancestry.dialect.dc:title', b)

    if (a2 < b2) return -1
    if (a2 > b2) return 1
    return 0
  }

  const portalListProps = {
    siteTheme: routeParams.siteTheme,
    filteredItems: null,
    fieldMapping: {
      title: 'contextParameters.lightancestry.dialect.dc:title',
      logo: 'contextParameters.lightportal.fv-portal:logo',
    },
    items: languageSites,
    languages: parentLanguages,
    isWorkspaces,
  }

  return children({
    isKids: routeParams.siteTheme === 'kids',
    isLoggedIn: computeLogin.success && computeLogin.isConnected,
    isWorkspaces,
    portalListProps,
  })
}
// PROPTYPES
const { func } = PropTypes
ExploreLanguagesData.propTypes = {
  children: func,
}

export default ExploreLanguagesData
