/*
    Old system:
    Home → Explore → Alqonquin → Mi'kmaw → Mi'kmaw → Learn → Words
    New release:
    Mi’kmaw Home Page → Learn → Words
*/
import React, { Component } from 'react'
import PropTypes from 'prop-types'
// REDUX
import { connect } from 'react-redux'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

import NavigationHelpers from 'common/NavigationHelpers'

import ProviderHelpers from 'common/ProviderHelpers'
import Immutable from 'immutable'
import { matchPath } from 'conf/routes'
import { SECTIONS } from 'common/Constants'
import '!style-loader!css-loader!./styles.css'

const { array, func, string, object } = PropTypes

const REMOVE_FROM_BREADCRUMBS = ['FV', 'sections', 'Data', 'Workspaces', 'search', 'nuxeo', 'app', 'explore']

export class Breadcrumb extends Component {
  static propTypes = {
    className: string,
    dataTestId: string,
    findReplace: object, // Note: {find: '', replace: ''}
    matchedPage: object, // Note: Immutable Obj
    routes: object, // Note: Immutable Obj
    // REDUX: actions/dispatch/func
    pushWindowPath: func.isRequired,
    // REDUX: reducers/state
    routeParams: object.isRequired,
    computeDialect2: object.isRequired,
    splitWindowPath: array.isRequired, // NOTE: Parent component is passing in `splitWindowPath` as a prop, see if that breaks anything
    intl: object.isRequired,
  }
  static defaultProps = {
    className: '',
    routeParams: {},
    matchedPage: Immutable.fromJS({}),
    routes: Immutable.fromJS({}),
    splitWindowPath: [],
  }

  //   constructor(props) {
  //     super(props)
  //     ;['_generateTiles', '_generateDialectFilterUrl', '_handleHistoryEvent'].forEach(
  //       (method) => (this[method] = this[method].bind(this))
  //     )
  //   }
  // const {dialect_name: dialect, language_family_name: languageFamily, language_name: language} = routeParams
  // console.log('!!!', `${dialect} Home Page`)
  render() {
    const content = this._renderBreadcrumb()
    return content
  }
  _renderBreadcrumb() {
    const { matchedPage, findReplace, routeParams, splitWindowPath, routes } = this.props
    // console.log('!!!', {
    //   matchedPage: JSON.stringify(matchedPage.toJS()),
    //   findReplace: JSON.stringify(findReplace),
    //   routeParams: JSON.stringify(routeParams),
    //   splitWindowPath: JSON.stringify(splitWindowPath),
    // })
    // Note: `splitPath` could be the `splitWindowPath` prop or what is returned from `breadcrumbPathOverride()`,
    //       `breadcrumbPathOverride` is an optional property on a route item, typically added via `addPagination()`
    let splitPath = splitWindowPath
    const breadcrumbPathOverride = matchedPage.get('breadcrumbPathOverride')
    if (breadcrumbPathOverride) {
      splitPath = breadcrumbPathOverride(splitPath)
    }

    // Figure out the index of the Dialect in splitPath
    let indexDialect = -1
    if (routeParams.dialect_path) {
      const dialectPathSplit = routeParams.dialect_path.split('/').filter((path) => {
        return path !== ''
      })
      const indexFV = splitPath.indexOf('FV')
      indexDialect = indexFV !== -1 ? indexFV + dialectPathSplit.length - 1 : -1
    }

    const breadcrumbs = splitPath.map((splitPathItem, splitPathIndex) => {
      if (
        splitPathItem &&
        splitPathItem !== '' &&
        REMOVE_FROM_BREADCRUMBS.indexOf(splitPathItem) === -1 &&
        splitPathIndex >= indexDialect // Omits Language and Language Family from breadcrumb
      ) {
        let pathTitle = splitPathItem

        if (findReplace) {
          pathTitle = splitPathItem.replace(findReplace.find, findReplace.replace)
        }

        const DialectHomePage = splitPathIndex === indexDialect ? this.props.intl.trans('home_page', 'Home Page') : ''
        let hrefPath = '/' + splitPath.slice(0, splitPathIndex + 1).join('/')

        // First breadcrumb item
        if (splitPathIndex === indexDialect) {
          const _computeDialect2 = ProviderHelpers.getEntry(
            this.props.computeDialect2,
            this.props.routeParams.dialect_path
          )
          const dialectTitle =
            _computeDialect2 && _computeDialect2.success
              ? _computeDialect2.response.properties['dc:title']
              : decodeURIComponent(pathTitle)

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
                  NavigationHelpers.navigate(hrefPath, this.props.pushWindowPath, false)
                }}
              >
                {breadcrumbItemTitle}
              </a>
            )

          return (
            <li key={splitPathIndex} className={`${splitPathIndex === splitPath.length - 1 ? 'active' : ''}`}>
              {breadcrumbItem}
            </li>
          )
        }
        // Last breadcrumb item (i.e. current page)
        if (splitPathIndex === splitPath.length - 1) {
          return (
            <li data-testid={'BreadcrumbCurrentPage'} key={splitPathIndex} className="active">
              {decodeURIComponent(pathTitle)}
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
                NavigationHelpers.navigate(hrefPath, this.props.pushWindowPath, false)
              }}
            >
              {`${this.props.intl.searchAndReplace(decodeURIComponent(pathTitle).replace('&amp;', '&'), {
                case: 'lower',
              })}`}
            </a>
          </li>
        )
      }
    })
    return <ul className={`Breadcrumb breadcrumb fontBCSans ${this.props.className}`}>{breadcrumbs}</ul>
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, navigation, windowPath, locale } = state

  const { computeDialect2 } = fvDialect
  const { splitWindowPath } = windowPath
  const { route } = navigation
  const { intlService } = locale
  return {
    computeDialect2,
    routeParams: route.routeParams,
    splitWindowPath,
    intl: intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  pushWindowPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(Breadcrumb)
