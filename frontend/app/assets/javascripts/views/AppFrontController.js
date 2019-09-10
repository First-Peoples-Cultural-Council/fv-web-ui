import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Immutable, { List } from 'immutable'

import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { pushWindowPath, replaceWindowPath, updateWindowPath } from 'providers/redux/reducers/windowPath'
import { changeTheme, setRouteParams } from 'providers/redux/reducers/navigation'

import selectn from 'selectn'

import classNames from 'classnames'

import ConfGlobal from 'conf/local.js'
import ConfRoutes, { matchPath } from 'conf/routes'
import { WORKSPACES } from 'common/Constants'

import ProviderHelpers from 'common/ProviderHelpers'
import { routeHasChanged, getSearchObject } from 'common/NavigationHelpers'
import { Redirector } from './Redirector'
// import UIHelpers from 'common/UIHelpers'
import StringHelpers from 'common/StringHelpers'
import Button from '@material-ui/core/Button'
import Navigation from 'views/components/Navigation'
import WorkspaceSwitcher from 'views/components/Navigation/WorkspaceSwitcher'
import KidsNavigation from 'views/components/Kids/navigation'
import Footer from 'views/components/Navigation/Footer'
import Breadcrumb from 'views/components/Breadcrumb'

import IntlService from 'views/services/intl'

import { PageError } from 'views/pages'

import '!style-loader!css-loader!./AppFrontController.css'

const { any, array, func, object, string } = PropTypes

const intl = IntlService.instance

const PAGE_NOT_FOUND_TITLE =
  '404 - ' +
  intl.translate({
    key: 'errors.page_not_found',
    default: 'Page Not Found',
    case: 'first',
  })

const PAGE_NOT_FOUND_BODY = (
  <div>
    <p>
      {intl.translate({
        key: 'errors.report_via_feedback',
        default: 'Please report this error so that we can fix it',
        case: 'first',
      })}
      .
    </p>
    <p>
      {intl.translate({
        key: 'errors.feedback_include_link',
        default: 'Include what link or action you took to get to this page',
      })}
      .
    </p>
    <p>
      {intl.translate({
        key: 'thank_you!',
        default: 'Thank You!',
        case: 'words',
      })}
    </p>
  </div>
)

export class AppFrontController extends Component {
  static propTypes = {
    warnings: object.isRequired,

    // loadGuide: func.isRequired,
    // loadNavigation: func.isRequired

    // REDUX: reducers/state
    computeLogin: object.isRequired,
    properties: object.isRequired,
    routeParams: object.isRequired,
    search: object.isRequired,
    matchedPage: any,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    updateWindowPath: func.isRequired,
    setRouteParams: func.isRequired,
    changeTheme: func.isRequired,
    pushWindowPath: func.isRequired,
    replaceWindowPath: func.isRequired,
  }

  static defaultProps = {
    matchedPage: undefined,
  }

  constructor(props, context) {
    super(props, context)

    this.state = this._getInitialState()
  }

  componentDidMount() {
    // NOTE: added to respond to `window.history.back()` calls
    window.addEventListener('popstate', this._handleHistoryEvent)
    // NOTE: this used to be called in `componentWillMount`
    this._route(this.props)
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
    const loggedIn = prevCl.isConnected !== curCl.isConnected && curCl.isConnected === true

    const { sortOrder: newSortOrder, sortBy: newSortBy } = this.props.search
    const { sortOrder: prevSortOrder, sortBy: prevSortBy } = prevProps.search
    const windowLocationSearch = getSearchObject()
    const windowLocationSearchSortOrder = windowLocationSearch.sortOrder
    const windowLocationSearchSortBy = windowLocationSearch.sortBy

    const sortOrderChanged = newSortOrder !== prevSortOrder || windowLocationSearchSortOrder != newSortOrder
    const sortByChanged = newSortBy !== prevSortBy || windowLocationSearchSortBy != newSortBy

    if (_routeHasChanged || loggedIn || sortOrderChanged || sortByChanged) {
      this._route(this.props)
    }
  }

  render() {
    const { matchedPage, routeParams } = this.props

    // NOTE: Due to the switch from `componentWillMount` to `componentDidMount`
    // `render` runs before we are ready, hence the empty div being returned
    if (matchedPage === undefined) {
      return <div />
    }

    const isFrontPage = !matchedPage ? false : matchedPage.get('frontpage')
    const hideNavigation = matchedPage && matchedPage.has('navigation') && matchedPage.get('navigation') === false

    let page

    let navigation = <Navigation frontpage={isFrontPage} routeParams={routeParams} />
    const theme = routeParams.hasOwnProperty('theme') ? routeParams.theme : 'default'
    // prettier-ignore
    const print = matchedPage
      ? matchedPage
        .get('page')
        .get('props')
        .get('print') === true
      : false

    let footer = <Footer className={'footer-' + theme + '-theme'} />

    const clonedElement = React.cloneElement(matchedPage.get('page').toJS(), { routeParams: routeParams })

    // For print view return page only
    if (print) {
      return <div style={{ margin: '25px' }}>{clonedElement}</div>
    }

    // Remove breadcrumbs for Kids portal
    // TODO: Make more generic if additional themes are added in the future.
    if (theme === 'kids') {
      page = clonedElement
      navigation = <KidsNavigation frontpage={isFrontPage} routeParams={routeParams} />
    } else {
      // Without breadcrumbs
      if (matchedPage.get('breadcrumbs') === false) {
        page = clonedElement
      } else {
        // With breadcrumbs
        page = this._renderWithBreadcrumb(clonedElement, matchedPage, this.props, theme)
      }
    }

    // Hide navigation
    if (hideNavigation) {
      navigation = footer = ''
    }

    return (
      <div>
        {(matchedPage && matchedPage.hasOwnProperty('warnings') ? matchedPage.get('warnings') : []).map((warning) => {
          if (this.props.warnings.hasOwnProperty(warning) && !this.state.warningsDismissed) {
            return (
              <div
                style={{ position: 'fixed', bottom: 0, zIndex: 99999 }}
                className={classNames('alert', 'alert-warning')}
              >
                {selectn(warning, this.props.warnings)}
                <Button onClick={() => this.setState({ warningsDismissed: true })}>
                  {intl.translate({
                    key: 'dismiss',
                    default: 'Dismiss',
                    case: 'words',
                  })}
                </Button>
              </div>
            )
          }
        })}
        <div className="AppFrontController__inner">
          <div id="pageNavigation" className="AppFrontController__navigation row">
            {navigation}
          </div>
          <div id="pageContainer" data-testid="pageContainer" className="AppFrontController__content">
            {page}
          </div>
          <div id="pageFooter" className="AppFrontController__footer row">
            {footer}
          </div>
        </div>
      </div>
    )
  }

  _getInitialState() {
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

  _renderWithBreadcrumb = (reactElement, matchedPage, props, theme) => {
    const themePalette = props.properties.theme.v0.palette
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
        <div className={'page-' + theme + '-theme'}>{reactElement}</div>
      </div>
    )
  }

  /**
   * Conditionally route the parameters.
   * This could normally go into the render method to keep things simple,
   * however redirecting (i.e. updating state), cannot be done inside render.
   */
  _route = (props, routesOverride = null) => {
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

      // Switch themes based on route params
      if (_routeParams.hasOwnProperty('theme')) {
        let newTheme = _routeParams.theme

        // Switch to workspace theme if available
        if (
          ((_routeParams.hasOwnProperty('area') && _routeParams.area === WORKSPACES) ||
            matchedPage.get('path').indexOf(WORKSPACES) !== -1) &&
          _routeParams.theme === 'explore'
        ) {
          newTheme = 'workspace'
          // Note: Also updating routeParams.area
          _routeParams.area = WORKSPACES
        }

        if (props.properties.theme.id !== newTheme) {
          props.changeTheme(newTheme)
        }
      } else {
        // NOTE: Initial theme state is now set in a redux reducer located at:
        //   app/assets/javascripts/providers/redux/reducers/navigation/reducer.js
        // props.changeTheme('default')
      }
      const matchReturn = {
        matchedPage,
        matchedRouteParams: _routeParams,
      }
      // Load help
      //props.loadGuide(props.windowPath, matchReturn);

      // Load Navigation
      //props.loadNavigation();

      // this.setState(matchReturn)
      this.props.setRouteParams({
        ...matchReturn,
        search: getSearchObject(),
      })
      return
    }
    // No match found (i.e. 404)
    const notFoundPage = Immutable.fromJS({
      title: PAGE_NOT_FOUND_TITLE,
      page: <PageError title={PAGE_NOT_FOUND_TITLE} body={PAGE_NOT_FOUND_BODY} />,
    })

    const matchReturn = {
      matchedPage: notFoundPage,
      matchedRouteParams: _routeParams,
    }

    // this.setState(matchReturn)
    this.props.setRouteParams({
      ...matchReturn,
      search: getSearchObject(),
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
        newTitle.push(intl.searchAndReplace(parts[i].trim()))
      }
      title = newTitle.join(' | ')
    }

    document.title = title
  }
}
// REDUX: reducers/state
const mapStateToProps = (state) => {
  const { navigation, nuxeo, windowPath } = state

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
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  pushWindowPath,
  replaceWindowPath,
  changeTheme,
  setRouteParams,
  updateWindowPath,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppFrontController)
