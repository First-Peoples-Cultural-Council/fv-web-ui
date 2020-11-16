import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Immutable, { is, List } from 'immutable'

import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { pushWindowPath, replaceWindowPath, updateWindowPath } from 'reducers/windowPath'
import { changeSiteTheme, setRouteParams } from 'reducers/navigation'
import { setIntlWorkspace } from 'reducers/locale'
import { nuxeoConnect, getCurrentUser } from 'reducers/nuxeo'

import selectn from 'selectn'

import classNames from 'classnames'

import ConfGlobal from 'common/conf/local.js'
import ConfRoutes, { matchPath } from 'common/conf/routes'
import { WORKSPACES } from 'common/Constants'

import { withTheme } from '@material-ui/core/styles'

import ProviderHelpers from 'common/ProviderHelpers'
import { routeHasChanged /*, getSearchObject*/ } from 'common/NavigationHelpers'
import { Redirector } from 'common/Redirector'
// import UIHelpers from 'common/UIHelpers'
import StringHelpers from 'common/StringHelpers'
import FVButton from 'components/FVButton'
import WorkspaceSwitcher from 'components/WorkspaceSwitcher'
import KidsNavigation from 'components/Kids/navigation'
import Breadcrumb from 'components/Breadcrumb'

import { PageError } from 'common/conf/pagesIndex'

import '!style-loader!css-loader!./AppFrontController.css'
import FVLabel from 'components/FVLabel'
import HelperModeToggle from 'components/HelperModeToggle/index'

export class AppFrontController extends Component {
  PAGE_NOT_FOUND_TITLE =
    '404 - ' +
    this.props.intl.translate({
      key: 'errors.page_not_found',
      default: 'Page Not Found',
      case: 'first',
    })

  PAGE_NOT_FOUND_BODY = (
    <div>
      <p>
        {this.props.intl.translate({
          key: 'errors.report_via_feedback',
          default: 'Please report this error so that we can fix it',
          case: 'first',
        })}
        .
      </p>
      <p>
        {this.props.intl.translate({
          key: 'errors.feedback_include_link',
          default: 'Include what link or action you took to get to this page',
        })}
        .
      </p>
      <p>
        {this.props.intl.translate({
          key: 'thank_you!',
          default: 'Thank You!',
          case: 'words',
        })}
      </p>
    </div>
  )

  constructor(props, context) {
    super(props, context)
    this.state = this._getInitialState()
  }

  async componentDidMount() {
    // NOTE: added to respond to `window.history.back()` calls
    window.addEventListener('popstate', this._handleHistoryEvent)

    // Connect to Nuxeo
    await this.props.nuxeoConnect()
    await this.props.getCurrentUser()

    // NOTE: this used to be called in `componentWillMount`
    this._route({ props: this.props })
  }

  componentDidUpdate(prevProps) {
    this._updateTitle()
    const _routeHasChanged = routeHasChanged({
      prevWindowPath: prevProps.windowPath,
      curWindowPath: this.props.windowPath,
      prevRouteParams: prevProps.routeParams,
      curRouteParams: this.props.routeParams,
    })
    if (_routeHasChanged) {
      // Track page view
      if (window.snowplow) {
        window.snowplow('trackPageView')
      }
    }

    // Re-route if needed:
    const prevCl = prevProps.computeLogin
    const curCl = this.props.computeLogin
    const newlyLoggedIn = curCl.isConnected === true && prevCl.isConnected !== true

    const { sortOrder: newSortOrder, sortBy: newSortBy } = this.props.search
    const { sortOrder: prevSortOrder, sortBy: prevSortBy } = prevProps.search

    const sortOrderChanged = newSortOrder !== prevSortOrder
    const sortByChanged = newSortBy !== prevSortBy

    if (_routeHasChanged || newlyLoggedIn || sortOrderChanged || sortByChanged) {
      this._route({ props: this.props })
      window.scrollTo(0, 0)
    }
    if (prevProps.routeParams.dialect_path !== this.props.routeParams.dialect_path) {
      this.props.setIntlWorkspace(this.props.routeParams.dialect_path)
    }

    // Note this code used to be in the render function
    // An issue with having it in render is that the children components would be
    // deleted & remounted. When that happens the child component would fire
    // componentDidMount multiple times.
    //
    // Most components make network requests on componentDidMount so we end up
    // with duplicate & unneccessary network requests being fired
    const { matchedPage, routeParams } = this.props
    const matchedPageUpdated = is(matchedPage, prevProps.matchedPage) === false
    const siteThemeUpdated = selectn('siteTheme', routeParams) !== selectn('siteTheme', prevProps.routeParams)
    // View during user checking, pre routing
    let isLoading = false
    if (matchedPage === undefined || this.props.localeLoading) {
      isLoading = true
    }

    const isFrontPage = !matchedPage ? false : matchedPage.get('frontpage')

    if (matchedPage && (matchedPageUpdated || siteThemeUpdated)) {
      let page
      let navigation

      const siteTheme = Object.prototype.hasOwnProperty.call(routeParams, 'siteTheme')
        ? routeParams.siteTheme
        : 'default'
      // prettier-ignore
      const isPrintView = matchedPage
        ? matchedPage
          .get('page')
          .get('props')
          .get('print') === true
        : false

      const clonedElement = React.cloneElement(matchedPage.get('page').toJS(), { routeParams: routeParams })

      // For print view return page only
      let print = null
      if (isPrintView) {
        print = <div style={{ margin: '25px' }}>{clonedElement}</div>
      }

      // Remove breadcrumbs for Kids portal
      // TODO: Make more generic if additional siteThemes are added in the future.
      if (siteTheme === 'kids' && !isFrontPage) {
        page = clonedElement
        navigation = <KidsNavigation frontpage={isFrontPage} routeParams={routeParams} />
      } else {
        // Without breadcrumbs
        if (matchedPage.get('breadcrumbs') === false) {
          page = clonedElement
        } else {
          // With breadcrumbs
          page = this._renderWithBreadcrumb(clonedElement, matchedPage, this.props, siteTheme)
        }
      }

      let warning = null

      if (Object.prototype.hasOwnProperty.call(matchedPage, 'warnings')) {
        warning = matchedPage.get('warnings').map((warningItem) => {
          if (Object.prototype.hasOwnProperty.call(this.props.warnings, warningItem) && !this.state.warningsDismissed) {
            return (
              <div
                style={{ position: 'fixed', bottom: 0, zIndex: 99999 }}
                className={classNames('alert', 'alert-warning')}
              >
                {selectn(warningItem, this.props.warnings)}
                <FVButton onClick={() => this.setState({ warningsDismissed: true })}>
                  <FVLabel transKey="dismiss" defaultStr="Dismiss" transform="words" />
                </FVButton>
              </div>
            )
          }
        })
      }

      this.setState({
        isLoading,
        page,
        print,
        navigation,
        warning,
      })
    }
  }

  render() {
    const { isLoading, page, print, warning, navigation } = this.state

    let toRender = null
    if (isLoading) {
      // Note: We could avoid showing this "Loading..." message if
      // PromiseWrapper would render a partial structure, then fill it with server data
      toRender = (
        <div className="app-loader">
          <p>Loading...</p>
        </div>
      )
    } else {
      if (print) {
        toRender = print
      } else {
        toRender = (
          <div>
            {warning}
            <div className="AppFrontController__inner">
              <div id="pageNavigation" className="AppFrontController__navigation row">
                {navigation}
              </div>
              <div id="pageContainer" data-testid="pageContainer" className="AppFrontController__content">
                {page}
              </div>
            </div>
            <HelperModeToggle />
          </div>
        )
      }
    }

    return toRender
  }

  _getInitialState() {
    // Replace Immutable usage here
    let routes = Immutable.fromJS(ConfRoutes)
    const contextPath = ConfGlobal.contextPath.split('/').filter((v) => v !== '')

    // Add context path to PATH and ALIAS properties if it is set (usually applies in DEV environment)
    if (contextPath && contextPath.length > 0) {
      routes = routes.map((route) => {
        let newRoute = route.set('path', List(contextPath).concat(route.get('path')))
        newRoute = newRoute.set('alias', List(contextPath).concat(route.get('alias')))
        return newRoute
      })
    }

    return {
      isLoading: true,
      routes,
      warningsDismissed: false,
    }
  }

  _handleHistoryEvent = (postStateEvent) => {
    const { state: postStateEventState } = postStateEvent
    if (postStateEventState) {
      const { windowPath } = postStateEventState
      // NOTE: windowPath === postStateEvent.state.windowPath
      this.props.updateWindowPath(windowPath)
    } else {
      this.props.updateWindowPath(window.location.pathname)
    }
  }

  _renderWithBreadcrumb = (reactElement, matchedPage, props, siteTheme) => {
    const themePalette = props.theme.palette
    const { routeParams } = reactElement.props
    const { /*splitWindowPath, */ computeLogin } = props
    const { routes } = this.state
    let _workspaceSwitcher = null
    const area = selectn('routeParams.area', reactElement.props)
    if (
      area &&
      selectn('isConnected', computeLogin) &&
      matchedPage.get('disableWorkspaceSectionNav') !== true &&
      !ProviderHelpers.isSiteMember(selectn('response.properties.groups', computeLogin))
    ) {
      _workspaceSwitcher = <WorkspaceSwitcher className="AppFrontController__workspaceSwitcher" area={area} />
    }
    const overrideBreadcrumbs = selectn('props.properties.breadcrumbs', this)
    const findReplace = overrideBreadcrumbs
      ? { find: overrideBreadcrumbs.find, replace: selectn(overrideBreadcrumbs.replace, this.props.properties) }
      : undefined
    return (
      <div>
        <div className="breadcrumbContainer row">
          <div className="AppFrontController__waypoint clearfix" style={{ backgroundColor: themePalette.accent4Color }}>
            <Breadcrumb
              className="AppFrontController__breadcrumb"
              matchedPage={matchedPage}
              routes={routes}
              routeParams={routeParams}
              // splitWindowPath={splitWindowPath}
              findReplace={findReplace}
            />
            {_workspaceSwitcher}
          </div>
        </div>
        <div className={'page-' + siteTheme + '-theme'}>{reactElement}</div>
      </div>
    )
  }

  /**
   * Conditionally route the parameters.
   * This could normally go into the render method to keep things simple,
   * however redirecting (i.e. updating state), cannot be done inside render.
   */
  _route = ({ props, routesOverride = null }) => {
    let matchedPage = null
    let _routeParams = {}
    const pathArray = props.splitWindowPath

    const routes = routesOverride || this.state.routes
    routes.forEach((value) => {
      const matchTest = matchPath(value.get('path'), pathArray)
      const matchAlias = matchPath(value.get('alias'), pathArray)

      if (matchTest.matched || matchAlias.matched) {
        const routeParams = matchTest.routeParams

        // Extract common paths from URL
        if (value.has('extractPaths') && value.get('extractPaths')) {
          const domainPathLocation = pathArray.indexOf(ConfGlobal.domain)
          const dialectPathLocation = 5
          const languagePathLocation = 4
          const languageFamilyPathLocation = 3

          // If domain is specified in the URL, these are Nuxeo paths that can be extracted
          if (domainPathLocation !== -1) {
            // Path from domain to end of path (e.g. /FV/Workspaces/Data/family/language/dialect)
            const nuxeoPath = pathArray.slice(domainPathLocation, pathArray.length)

            if (nuxeoPath.length >= dialectPathLocation) {
              routeParams.dialect_name = decodeURI(nuxeoPath[dialectPathLocation])
              routeParams.dialect_path = decodeURI('/' + nuxeoPath.slice(0, dialectPathLocation + 1).join('/'))
            }

            if (nuxeoPath.length >= languagePathLocation) {
              routeParams.language_name = decodeURI(nuxeoPath[languagePathLocation])
              routeParams.language_path = decodeURI('/' + nuxeoPath.slice(0, languagePathLocation + 1).join('/'))
            }

            if (nuxeoPath.length >= languageFamilyPathLocation) {
              routeParams.language_family_name = decodeURI(nuxeoPath[languageFamilyPathLocation])
              routeParams.language_family_path = decodeURI(
                '/' + nuxeoPath.slice(0, languageFamilyPathLocation + 1).join('/')
              )
            }
          }
        }

        matchedPage = value
        _routeParams = routeParams

        // Break out of forEach
        return false
      }
    })

    // Match found
    // ----------------------------------------------
    if (matchedPage !== null) {
      // Redirect if required
      if (matchedPage.has('redirects')) {
        matchedPage.get('redirects').forEach((value) => {
          if (value.get('condition')({ props: props })) {
            // Avoid invariant violations during rendering by setting temporary placeholder component as matched page, and 'redirecting' after mount.
            matchedPage = matchedPage.set(
              'page',
              Immutable.fromJS(
                React.createElement(
                  Redirector,
                  {
                    redirect: () => {
                      return props.replaceWindowPath(value.get('target')({ props: props }))
                    },
                  },
                  matchedPage.get('page')
                )
              )
            )

            return false
          }
        })
      }

      // Switch siteThemes based on route params
      const _siteTheme = Object.prototype.hasOwnProperty.call(_routeParams, 'siteTheme') || matchedPage.get('siteTheme')
      if (_siteTheme) {
        let newTheme = _siteTheme

        /*
        When to switch to workspace theme:

              routeParams has area=WORKSPACES
                or
              matchedPage.path contains WORKSPACES
                or
              matchedPage.siteTheme=WORKSPACES

                AND

              current theme is not 'workspace'

          TODO: investigate if statecharts would simplify matters
        */
        if (
          ((Object.prototype.hasOwnProperty.call(_routeParams, 'area') && _routeParams.area === WORKSPACES) ||
            matchedPage.get('path').indexOf(WORKSPACES) !== -1 ||
            matchedPage.get('siteTheme') === WORKSPACES) &&
          _routeParams.siteTheme !== 'workspace'
        ) {
          newTheme = 'workspace'
          // Note: Also updating routeParams.area
          _routeParams.area = WORKSPACES
        }

        if (props.properties.siteTheme !== newTheme) {
          props.changeSiteTheme(newTheme)
        }
      }

      this.props.setRouteParams({
        matchedPage,
        matchedRouteParams: _routeParams,
      })

      return
    }

    // No match found (i.e. 404)
    // ----------------------------------------------
    const notFoundPage = Immutable.fromJS({
      title: this.PAGE_NOT_FOUND_TITLE,
      page: <PageError title={this.PAGE_NOT_FOUND_TITLE} body={this.PAGE_NOT_FOUND_BODY} />,
    })

    this.props.setRouteParams({
      matchedPage: notFoundPage,
      matchedRouteParams: _routeParams,
    })
  }

  /**
   * Dynamically update title
   */
  _updateTitle = () => {
    // Title provided from within a component
    const pageTitleParams = this.props.properties.pageTitleParams

    let title = this.props.properties.title

    if (
      this.props.matchedPage &&
      this.props.matchedPage.has('title') &&
      this.props.matchedPage.get('title') &&
      this.props.matchedPage.get('title') !== document.title
    ) {
      const combinedRouteParams = Object.assign({}, this.props.routeParams, pageTitleParams)

      title = this.props.matchedPage.get('title')
      Object.keys(combinedRouteParams).forEach((route) => {
        title = title.replace('{$' + route + '}', StringHelpers.toTitleCase(combinedRouteParams[route]))
      })

      title = title + ' | ' + this.props.properties.title
    }

    if (title.search(' | ') >= 0) {
      const newTitle = []

      const parts = title.split('|')

      let i
      for (i in parts) {
        newTitle.push(this.props.intl.searchAndReplace(parts[i].trim()))
      }
      title = newTitle.join(' | ')
    }

    document.title = title
  }
}

// PROPTYPES
const { any, array, func, object, string } = PropTypes
AppFrontController.propTypes = {
  warnings: object.isRequired,
  // REDUX: reducers/state
  computeLogin: object.isRequired,
  matchedPage: any,
  properties: object.isRequired,
  routeParams: object.isRequired,
  search: object.isRequired,
  splitWindowPath: array.isRequired,
  windowPath: string.isRequired,
  localeLoading: any,
  // REDUX: actions/dispatch/func
  changeSiteTheme: func.isRequired,
  getCurrentUser: func.isRequired,
  nuxeoConnect: func.isRequired,
  pushWindowPath: func.isRequired,
  replaceWindowPath: func.isRequired,
  setRouteParams: func.isRequired,
  updateWindowPath: func.isRequired,
}
AppFrontController.defaultProps = {
  matchedPage: undefined,
}
// REDUX: reducers/state
const mapStateToProps = (state) => {
  const { navigation, nuxeo, windowPath, locale } = state

  const { properties, route } = navigation
  const { computeLogin } = nuxeo
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeLogin,
    properties,
    routeParams: route.routeParams,
    matchedPage: route.matchedPage,
    search: route.search,
    splitWindowPath,
    windowPath: _windowPath,
    localeLoading: selectn('fvlabelsFetch.isFetching', locale),
    intl: locale.intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  pushWindowPath,
  replaceWindowPath,
  changeSiteTheme,
  setRouteParams,
  updateWindowPath,
  nuxeoConnect,
  getCurrentUser,
  setIntlWorkspace,
}

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(AppFrontController))
