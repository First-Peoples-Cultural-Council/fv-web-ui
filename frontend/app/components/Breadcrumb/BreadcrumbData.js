import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Immutable from 'immutable'
import selectn from 'selectn'

// FPCC
import NavigationHelpers from 'common/NavigationHelpers'
import ProviderHelpers from 'common/ProviderHelpers'
import UIHelpers from 'common/UIHelpers'
import { matchPath } from 'common/conf/routes'
import { SECTIONS } from 'common/Constants'
import FVLabel from 'components/FVLabel'

// DataSources
import useDialect from 'dataSources/useDialect'
import useIntl from 'dataSources/useIntl'
import usePortal from 'dataSources/usePortal'
import useProperties from 'dataSources/useProperties'
import useRoute from 'dataSources/useRoute'
import useWindowPath from 'dataSources/useWindowPath'

import './Breadcrumb.css'

/**
 * @summary BreadcrumbData
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 * @param {function} props.children
 *
 */
function BreadcrumbData({ children, matchedPage, routes }) {
  const { computeDialect2 } = useDialect()
  const { intl } = useIntl()
  const { fetchPortal, computePortal } = usePortal()
  const { properties } = useProperties()
  const { routeParams } = useRoute()
  const { pushWindowPath, splitWindowPath } = useWindowPath()

  const REMOVE_FROM_BREADCRUMBS = ['FV', 'sections', 'Data', 'Workspaces', 'search', 'nuxeo', 'app', 'explore']
  const isDialect = Object.prototype.hasOwnProperty.call(routeParams, 'dialect_path')

  let splitPath = splitWindowPath

  const breadcrumbPathOverride = matchedPage.get('breadcrumbPathOverride')
  if (breadcrumbPathOverride) {
    splitPath = breadcrumbPathOverride(splitPath)
  }

  const overrideBreadcrumbTitle = properties.breadcrumbs
  const findReplace = overrideBreadcrumbTitle
    ? { find: overrideBreadcrumbTitle.find, replace: selectn(overrideBreadcrumbTitle.replace, properties) }
    : undefined

  const portalPath = `${routeParams.dialect_path}/Portal`

  // FW-1534: Map translations in breadcrumbs to translation keys
  // These links are accessible in ExploreDialect.js
  const mapTraslationKey = function (pathKey) {
    switch (pathKey) {
      case 'learn':
        return 'views.pages.explore.dialect.learn_our_language'
      case 'gallery':
        return 'views.pages.explore.dialect.photo_gallery'
      case 'kids':
        return 'views.pages.explore.dialect.kids_portal'
      case 'play':
        return 'views.pages.explore.dialect.play_game'
      default:
        // If general does not exist, FVLabel will fall back to default string
        return 'general.' + pathKey
    }
  }

  useEffect(() => {
    // If searching within a dialect, fetch portal (needed for portal logo src)
    if (isDialect) {
      ProviderHelpers.fetchIfMissing({
        key: portalPath,
        action: fetchPortal,
        reducer: computePortal,
      })
    }
  }, [])

  const computedPortal = ProviderHelpers.getEntry(computePortal, portalPath)
  const portalLogo = selectn('response.contextParameters.portal.fv-portal:logo', computedPortal)
  const portalLogoSrc = UIHelpers.getThumbnail(portalLogo, 'Thumbnail')

  // Figure out the index of the Dialect in splitPath
  let indexDialect = -1
  if (routeParams.dialect_path) {
    const dialectPathSplit = routeParams.dialect_path.split('/').filter((path) => {
      return path !== ''
    })
    const indexFV = splitWindowPath.indexOf('FV')
    indexDialect = indexFV !== -1 ? indexFV + dialectPathSplit.length - 1 : -1
  }

  const breadcrumbs = splitPath.map((splitPathItem, splitPathIndex) => {
    if (
      splitPathItem &&
      splitPathItem !== '' &&
      REMOVE_FROM_BREADCRUMBS.indexOf(splitPathItem) === -1 &&
      splitPathIndex >= indexDialect // Omits Language and Language Family from breadcrumb
    ) {
      const pathTitle = findReplace ? splitPathItem.replace(findReplace.find, findReplace.replace) : splitPathItem
      const decodedPathTitle = decodeURIComponent(pathTitle).replace('&amp;', '&')

      const DialectHomePage = splitPathIndex === indexDialect ? intl.trans('home_page', 'Home Page') : ''
      let hrefPath = '/' + splitPath.slice(0, splitPathIndex + 1).join('/')

      // First breadcrumb item
      if (splitPathIndex === indexDialect) {
        const _computeDialect2 = ProviderHelpers.getEntry(computeDialect2, routeParams.dialect_path)
        const dialectTitle =
          _computeDialect2 && _computeDialect2.success
            ? _computeDialect2.response.properties['dc:title']
            : decodedPathTitle

        const breadcrumbItemTitle = `${dialectTitle} ${DialectHomePage}`
        const breadcrumbItem =
          splitPathIndex === splitPath.length - 1 ? (
            breadcrumbItemTitle
          ) : (
            <a
              key={splitPathIndex}
              href={hrefPath}
              onClick={(e) => {
                e.preventDefault()
                NavigationHelpers.navigate(hrefPath, pushWindowPath, false)
              }}
            >
              {breadcrumbItemTitle}
            </a>
          )

        return (
          <li
            key={splitPathIndex}
            className={`${splitPathIndex === splitPath.length - 1 ? 'active' : ''} Breadcrumb__first`}
          >
            {breadcrumbItem}
          </li>
        )
      }
      // Last breadcrumb item (i.e. current page)
      if (splitPathIndex === splitPath.length - 1) {
        return (
          <li data-testid={'BreadcrumbCurrentPage'} key={splitPathIndex} className="active">
            <FVLabel transKey={mapTraslationKey(decodedPathTitle)} defaultStr={decodedPathTitle} case="lower" />
          </li>
        )
      }

      // Middle breadcrumb items
      /**
       * Replace breadcrumb entry with redirect value. Solved some rendering issues. Needs more robust solution though.
       */
      // PSUEDO: check each route
      routes.forEach((value) => {
        // PSUEDO: compare route path with breadcrumb path
        const matchTest = matchPath(value.get('path'), [splitPathItem])
        if (matchTest.matched) {
          /* PSUEDO: A route entry can have a `redirects` prop that will be used to update `hrefPath`
            eg:
            redirects: [{
              condition: ({
                props: {computeLogin, splitWindowPath}
              })=>{},
              target: ({
                props: {splitWindowPath}
              })=>{}
            }],
            */
          if (value.has('redirects')) {
            value.get('redirects').forEach((redirectValue) => {
              if (redirectValue.get('condition')({ props: this.props })) {
                hrefPath = redirectValue.get('target')({ props: this.props })
                hrefPath = hrefPath.replace(SECTIONS, routeParams.area || splitPath[2] || SECTIONS)

                return false
              }
            })
          }

          // Break out of forEach
          return false
        }
      })

      return (
        <li key={splitPathIndex}>
          <a
            key={splitPathIndex}
            href={hrefPath}
            onClick={(e) => {
              e.preventDefault()
              NavigationHelpers.navigate(hrefPath, pushWindowPath, false)
            }}
          >
            <FVLabel transKey={mapTraslationKey(decodedPathTitle)} defaultStr={decodedPathTitle} case="lower" />
          </a>
        </li>
      )
    }
  })
  return children({
    breadcrumbs,
    isDialect,
    portalLogoSrc,
  })
}
// PROPTYPES
const { func, object } = PropTypes
BreadcrumbData.propTypes = {
  children: func,
  matchedPage: object,
  routes: object,
}

BreadcrumbData.defaultProps = {
  matchedPage: Immutable.fromJS({}),
  routes: Immutable.fromJS({}),
}

export default BreadcrumbData
