import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'

// DataSources
import useIntl from 'dataSources/useIntl'
import useLocale from 'dataSources/useLocale'
import useLogin from 'dataSources/useLogin'
import useNavigation from 'dataSources/useNavigation'
import usePortal from 'dataSources/usePortal'
// import useProperties from 'dataSources/useProperties'
import useRoute from 'dataSources/useRoute'
import useWindowPath from 'dataSources/useWindowPath'

// Common
import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers, { getSearchObjectAsUrlQuery } from 'common/NavigationHelpers'
import UIHelpers from 'common/UIHelpers'
import useNavigationHelpers from 'common/useNavigationHelpers'
// import StringHelpers, { CLEAN_FULLTEXT } from 'common/StringHelpers'
// import { SECTIONS, WORKSPACES } from 'common/Constants'

/**
 * @summary NavigationBarData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function NavigationBarData({ children }) {
  //DataSources
  const { intl } = useIntl()
  const { computeLogin } = useLogin()
  const { setLocale } = useLocale()
  const { computeLoadNavigation, loadNavigation, toggleMenuAction } = useNavigation()
  const { getSearchObject, navigate } = useNavigationHelpers()
  const { computePortal } = usePortal()
  const { routeParams } = useRoute()
  const { windowPath, splitWindowPath } = useWindowPath()

  const isDialect = routeParams.hasOwnProperty('dialect_path')
  const computedPortal = ProviderHelpers.getEntry(computePortal, routeParams.dialect_path + '/Portal')
  const portalLogo = selectn('response.contextParameters.portal.fv-portal:logo', computedPortal)
  const avatarSrc = UIHelpers.getThumbnail(portalLogo, 'Thumbnail')
  const portalTitle = routeParams.dialect_name || ''
  const dialectHref = NavigationHelpers.generateStaticURL('/explore' + routeParams.dialect_path)
  const dashboardHref = NavigationHelpers.generateStaticURL('/dashboard')

  // Local state
  const [localePopoverOpen, setLocalePopoverOpen] = useState(false)
  const [searchPopoverOpen, setSearchPopoverOpen] = useState(false)
  const [searchLocation, setSearchLocation] = useState('local')
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    // Only load navigation once
    if (!computeLoadNavigation.success) {
      loadNavigation()
    }
  }, [])

  useEffect(() => {
    setSearchPopoverOpen(false)
  }, [windowPath, routeParams])

  const handleNavigationSearchSubmit = () => {
    // If searched w/nothing focus on input and don't continue
    if (searchValue === '') {
      //   showSearchPopup(event)
      return
    }
    setSearchPopoverOpen(false)

    const searchQueryParam = searchValue
    const path = '/' + splitWindowPath.join('/')
    let queryPath = ''

    // Do a global search in either the workspace or section
    if (path.includes('/explore/FV/Workspaces/Data')) {
      queryPath = 'explore/FV/Workspaces/Data'
    } else if (path.includes('/explore/FV/sections/Data')) {
      queryPath = 'explore/FV/sections/Data'
    } else {
      queryPath = 'explore/FV/sections/Data'
    }

    // Do a dialect search
    if (routeParams.dialect_path && searchLocation === 'local') {
      queryPath = 'explore' + routeParams.dialect_path
    }

    // Clear out the input field
    setSearchValue('')

    if (searchQueryParam && searchQueryParam !== '') {
      const finalPath = NavigationHelpers.generateStaticURL(queryPath + '/search')
      navigate(
        `${finalPath}?${getSearchObjectAsUrlQuery(Object.assign({}, getSearchObject(), { query: searchQueryParam }))}`
      )
    }
  }

  const handleChangeLocale = (event) => {
    setLocale(event.target.value)
  }

  const handleChangeSearchLocation = (event) => {
    setSearchLocation(event.target.value)
  }

  const handleOpenMenuRequest = () => {
    toggleMenuAction()
  }

  const handleSearchPopoverClose = () => {
    setSearchPopoverOpen(false)
  }
  const handleSearchPopoverOpen = () => {
    setSearchPopoverOpen(true)
  }
  const handleSearchTextFieldChange = (event) => {
    setSearchValue(event.target.value)
  }

  const toggleDisplayLocaleOptions = () => {
    setLocalePopoverOpen(!localePopoverOpen)
  }

  return children({
    avatarSrc,
    computeLogin,
    dashboardHref,
    dialectHref,
    handleChangeImmersion: () => {},
    handleChangeLocale,
    handleChangeSearchLocation,
    handleNavigationSearchSubmit,
    handleOpenMenuRequest,
    handleSearchPopoverClose,
    handleSearchPopoverOpen,
    handleSearchTextFieldChange,
    intl,
    isDialect,
    localePopoverOpen,
    portalTitle,
    routeParams,
    searchPopoverOpen,
    searchValue,
    toggleDisplayLocaleOptions,
  })
}
// PROPTYPES
const { func } = PropTypes
NavigationBarData.propTypes = {
  children: func,
}

export default NavigationBarData
