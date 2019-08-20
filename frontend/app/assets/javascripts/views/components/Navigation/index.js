/*
Copyright 2016 First People's Cultural Council
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import selectn from 'selectn'
// import ConfGlobal from 'conf/local.js'

// REDUX
import { connect } from 'react-redux'
import { loadNavigation, toggleMenuAction } from 'providers/redux/reducers/navigation'
import { pushWindowPath, replaceWindowPath } from 'providers/redux/reducers/windowPath'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers, { routeHasChanged } from 'common/NavigationHelpers'
import UIHelpers from 'common/UIHelpers'

import AppBar from 'material-ui/AppBar'
import TextField from 'material-ui/TextField'

import MenuItem from 'material-ui/MenuItem'
import ToolbarSeparator from 'material-ui/Toolbar/ToolbarSeparator'
import RadioButton from 'material-ui/RadioButton'
import RadioButtonGroup from 'material-ui/RadioButton/RadioButtonGroup'

import DropDownMenu from 'material-ui/DropDownMenu'
import FlatButton from 'material-ui/FlatButton'
import Toolbar from 'material-ui/Toolbar/Toolbar'
import ToolbarGroup from 'material-ui/Toolbar/ToolbarGroup'
import IconButton from 'material-ui/IconButton'
import Popover from 'material-ui/Popover'
import Avatar from 'material-ui/Avatar'

import IconMenu from '@material-ui/icons/Reorder'

import AuthenticationFilter from 'views/components/Document/AuthenticationFilter'

import Login from 'views/components/Navigation/Login'
import AppLeftNav from 'views/components/Navigation/AppLeftNav'

import IntlService from 'views/services/intl'

import ToolbarTitle from 'material-ui/Toolbar/ToolbarTitle'
import { getDialectClassname } from 'views/pages/explore/dialect/helpers'

import { WORKSPACES, SECTIONS } from 'common/Constants'

import '!style-loader!css-loader!./styles.css'

const { array, func, object, string, bool } = PropTypes

export class Navigation extends Component {
  intl = IntlService.instance

  static defaultProps = {
    frontpage: false,
  }

  static propTypes = {
    frontpage: bool,
    // REDUX: reducers/state
    routeParams: object.isRequired,
    computeDialect2: object,
    computeLoadNavigation: object.isRequired,
    computeLogin: object.isRequired,
    computePortal: object,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // computeToggleMenuAction: object.isRequired,
    // computeCountTotalTasks: object.isRequired,
    // computeLoadGuide: object.isRequired,

    // REDUX: actions/dispatch/func
    loadNavigation: func.isRequired,
    pushWindowPath: func.isRequired,
    replaceWindowPath: func.isRequired,
    toggleMenuAction: func.isRequired,
    // countTotalTasks: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      searchBarVisibleInMobile: false,
      searchContextPopoverOpen: false,
      searchContextPopoverAnchorEl: null,
      searchLocal: true,
      localePopoverOpen: false,
      userRegistrationTasksPath: '/management/registrationRequests/',
      pathOrId: '/' + props.properties.domain + '/' + selectn('routeParams.area', props),
      locale: this.intl.locale,
      searchValue: '',
    }
  }

  componentDidUpdate(prevProps) {
    // if (this.props.computeLogin != prevProps.computeLogin && this.props.computeLogin.isConnected) {
    //     this.props.countTotalTasks('count_total_tasks', {
    //         'query': 'SELECT COUNT(ecm:uuid) FROM TaskDoc, FVUserRegistration WHERE (ecm:currentLifeCycleState = \'opened\' OR ecm:currentLifeCycleState = \'created\')',
    //         'language': 'nxql',
    //         'sortOrder': 'ASC'
    //     });
    // }
    const USER_LOG_IN_STATUS_CHANGED =
      this.props.computeLogin.isConnected !== prevProps.computeLogin.isConnected &&
      this.props.computeLogin.isConnected !== undefined &&
      prevProps.computeLogin.isConnected !== undefined

    if (USER_LOG_IN_STATUS_CHANGED || this.props.routeParams.area !== prevProps.routeParams.area) {
      this._setExplorePath(this.props)
    }

    // Remove popover upon navigation
    if (
      routeHasChanged({
        prevWindowPath: prevProps.windowPath,
        curWindowPath: this.props.windowPath,
        prevRouteParams: prevProps.routeParams,
        curRouteParams: this.props.routeParams,
      })
    ) {
      this.setState({
        searchContextPopoverOpen: false,
      })
    }
  }

  componentDidMount() {
    this._setExplorePath()

    // Ensure Search Box blur does not remove Popover when focusing on search options (only applies to Dialect pages)
    //document.body.addEventListener('click', this._removePopoverUnlessOptionSelected);

    // Only load navigation once
    if (!this.props.computeLoadNavigation.success) {
      this.props.loadNavigation()
    }
  }

  render() {
    const themePalette = this.props.properties.theme.palette.rawTheme.palette
    const isDialect = this.props.routeParams.hasOwnProperty('dialect_path')
    const computePortal = ProviderHelpers.getEntry(
      this.props.computePortal,
      this.props.routeParams.dialect_path + '/Portal'
    )

    // NOTE: TBD, looks like work in progress. There's related jsx
    // const computeCountTotalTasks = ProviderHelpers.getEntry(this.props.computeCountTotalTasks, "count_total_tasks")
    // const userTaskCount = selectn("response.entries[0].COUNT(ecm:uuid)", computeCountTotalTasks) || 0

    const portalLogo = selectn('response.contextParameters.portal.fv-portal:logo', computePortal)
    const avatarSrc = UIHelpers.getThumbnail(portalLogo, 'Thumbnail')

    // V1:
    // const computeDialect = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)
    // const portalTitle =
    //   selectn('response.contextParameters.ancestry.dialect.dc:title', computePortal) ||
    //   selectn('response.properties.dc:title', computeDialect)
    // V2:
    const portalTitle = this.props.routeParams.dialect_name || ''

    const dialectLink = '/explore' + this.props.routeParams.dialect_path
    const hrefPath = NavigationHelpers.generateDynamicURL('page_explore_dialects', this.props.routeParams)
    return (
      <div className="Navigation">
        <AppBar
          title={
            <span className="hidden-xs">
              <img src="assets/images/logo.png" style={{ padding: '0 0 5px 0' }} alt={this.props.properties.title} />
            </span>
          }
          iconElementLeft={
            <button
              type="button"
              className="Navigation__open"
              data-testid="Navigation__open"
              onClick={this._handleOpenMenuRequest}
            >
              <IconMenu className="Navigation__openIcon" />
              <span className="visually-hidden">Menu open</span>
            </button>
          }
        >
          <ToolbarGroup style={{ position: 'relative', color: '#fff' }}>
            <div
              style={{ display: 'inline-block', paddingRight: '10px', paddingTop: '15px', textTransform: 'uppercase' }}
            >
              {/* <Link
                className="nav_link hidden-xs"
                href={NavigationHelpers.generateDynamicURL('page_explore_dialects', this.props.routeParams)}
              >
                {this.intl.trans('choose_lang', 'Choose a Language', 'first')}
              </Link> */}
              <a
                href={hrefPath}
                className="Navigation__link nav_link hidden-xs"
                onClick={(e) => {
                  e.preventDefault()
                  NavigationHelpers.navigate(hrefPath, this.props.pushWindowPath, false)
                }}
              >
                {/* {this.intl.trans('choose_lang', 'Choose a Language', 'first')} */}
                {this.intl.translate({ key: 'general.explore', default: 'Explore Languages', case: 'title' })}
              </a>
            </div>

            <Login
              routeParams={this.props.routeParams}
              label={this.intl.translate({
                key: 'views.pages.users.login.sign_in',
                default: 'Sign In',
                case: 'words',
              })}
            />

            <ToolbarSeparator
              className={classNames({ hidden: !this.props.computeLogin.isConnected })}
              style={{ float: 'none', marginLeft: 0, marginRight: 10 }}
            />

            <AuthenticationFilter
              login={this.props.computeLogin}
              anon={false}
              routeParams={this.props.routeParams}
              containerStyle={{ display: 'inline' }}
            >
              <span>
                {/* <Badge
                  badgeContent={userTaskCount}
                  style={{ top: "8px", left: "-15px", padding: "0 0 12px 12px" }}
                  badgeStyle={{
                    top: "12px",
                    left: "42px",
                    width: "15px",
                    height: "15px",
                    borderRadius: "25%",
                    visibility: userTaskCount == 0 ? "hidden" : "visible",
                  }}
                  primary
                >
                  <IconButton
                    iconStyle={{ fill: "#fff" }}
                    onClick={this._onNavigateRequest.bind(this, "/tasks/")}
                    disabled={userTaskCount == 0 ? true : false}
                  >
                    <NotificationsIcon />
                  </IconButton>
                </Badge> */}

                <a href={NavigationHelpers.generateStaticURL('/tasks')} className="Navigation__link nav_link">
                  View My Tasks
                </a>
              </span>
            </AuthenticationFilter>

            <ToolbarSeparator
              className="search-bar-seperator"
              style={{ float: 'none', marginRight: 0, marginLeft: 10 }}
            />

            <div
              style={{ background: themePalette.primary1Color, display: 'inline-block' }}
              className={classNames({
                'hidden-xs': !this.state.searchBarVisibleInMobile,
                'search-bar-mobile': this.state.searchBarVisibleInMobile,
              })}
            >
              <TextField
                underlineStyle={{ width: '79%' }}
                style={{
                  marginLeft: this.state.searchBarVisibleInMobile ? '15px' : '30px',
                  fontSize: '15px',
                  backgroundColor: '#fff',
                  paddingLeft: '10px',
                  lineHeight: '1.5',
                  width: this.state.searchBarVisibleInMobile ? '214px' : 'inherit',
                  paddingRight: this.state.searchBarVisibleInMobile ? '0' : '40px',
                  fontFamily:
                    '"Aboriginal Sans", "Aboriginal Serif", "Lucida Grande", "Lucida Sans Unicode", Gentium, Code2001',
                }}
                ref="navigationSearchField" // TODO: DEPRECATED
                hintText={this.intl.translate({ key: 'general.search', default: 'Search', case: 'first', append: ':' })}
                onBlur={() => this.setState({ searchContextPopoverOpen: isDialect ? true : false })}
                onFocus={(e) =>
                  this.setState({ searchContextPopoverOpen: true, searchContextPopoverAnchorEl: e.target })
                }
                onChange={(e) => {
                  this.setState({ searchValue: e.target.value })
                }}
                value={this.state.searchValue}
                className={getDialectClassname()}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    this._handleNavigationSearchSubmit(e)
                  }
                }}
                name="searchbox"
              />
              <FlatButton
                className={classNames({ hidden: !this.state.searchBarVisibleInMobile })}
                style={{ color: themePalette.alternateTextColor }}
                label={this.intl.translate({ key: 'general.cancel', default: 'Cancel', case: 'first' })}
                onClick={(e) => {
                  this.setState({ searchBarVisibleInMobile: false })
                  e.preventDefault()
                }}
              />
            </div>

            <IconButton
              onClick={this._handleNavigationSearchSubmit}
              iconClassName="material-icons"
              style={{ position: 'relative', top: '7px', padding: '0', left: 0 }}
              iconStyle={{ fontSize: '24px', padding: '3px', borderRadius: '20px', color: '#FFFFFF' }}
            >
              search
            </IconButton>

            <Popover
              useLayerForClickAway={false}
              open={this.state.searchContextPopoverOpen}
              anchorEl={this.state.searchContextPopoverAnchorEl}
              style={{
                maxWidth: isDialect ? '320px' : '220px',
                marginTop: '-14px',
                backgroundColor: 'transparent',
                boxShadow: 'none',
              }}
              anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
              targetOrigin={{ horizontal: 'middle', vertical: 'top' }}
            >
              <div>
                <img
                  style={{ position: 'relative', top: '14px', zIndex: 999999, paddingTop: '14px', left: '80%' }}
                  src="assets/images/popover-arrow.png"
                  alt=""
                />
                {(() => {
                  if (isDialect) {
                    return (
                      <div
                        style={{
                          marginBottom: 0,
                          padding: '10px 10px 1px 10px',
                          backgroundColor: '#fff',
                          fontSize: '0.95em',
                        }}
                      >
                        <p style={{ padding: 0 }}>
                          {this.intl.translate({
                            key: 'general.select_search_option',
                            default: 'Select Search Option',
                            case: 'words',
                          })}
                        </p>
                        <div>
                          <RadioButtonGroup
                            onChange={() => this.setState({ searchLocal: !this.state.searchLocal })}
                            name="searchTarget"
                            defaultSelected="local"
                          >
                            <RadioButton
                              value={this.intl.translate({
                                key: 'general.all',
                                default: 'all',
                                case: 'lower',
                              })}
                              label={
                                <span style={{ fontWeight: '400' }}>
                                  FirstVoices.com <br />{' '}
                                  <span
                                    style={{
                                      fontWeight: '300',
                                      color: '#959595',
                                    }}
                                  >
                                    {this.intl.translate({
                                      key: 'views.components.navigation.all_languages_and_words',
                                      default: 'All languages & words',
                                      case: 'words',
                                      append: '.',
                                    })}
                                  </span>
                                </span>
                              }
                            />
                            <RadioButton
                              value="local"
                              label={
                                <span style={{ fontWeight: '400' }}>
                                  {portalTitle ||
                                    this.intl.translate({
                                      key: 'views.components.navigation.this_dialect',
                                      default: 'This Dialect',
                                      case: 'words',
                                    })}
                                  <br />{' '}
                                  <span
                                    style={{
                                      fontWeight: '300',
                                      color: '#959595',
                                    }}
                                  >
                                    {this.intl.translate({
                                      key: 'general.words',
                                      default: 'Words',
                                      case: 'first',
                                    })}
                                    ,{' '}
                                    {this.intl.translate({
                                      key: 'general.phrases',
                                      default: 'Phrases',
                                      case: 'first',
                                    })}
                                    ,{' '}
                                    {this.intl.translate({
                                      key: 'general.songs_and_stories',
                                      default: 'Songs &amp; Stories',
                                      case: 'words',
                                      append: '.',
                                    })}
                                  </span>
                                </span>
                              }
                            />
                          </RadioButtonGroup>
                        </div>
                      </div>
                    )
                  }
                  return (
                    <div style={{ marginBottom: 0, padding: '10px 10px 1px 10px', backgroundColor: '#fff' }}>
                      <p style={{ padding: 0 }}>
                        {this.intl.translate({
                          key: 'views.components.navigation.search_all',
                          default: 'Search all languages & words at FirstVoices.com',
                          case: 'first',
                        })}
                      </p>
                    </div>
                  )
                })()}
              </div>
            </Popover>

            <ToolbarSeparator className="locale-seperator" style={{ float: 'none', marginRight: 0, marginLeft: 0 }} />

            <IconButton
              onClick={this._handleDisplayLocaleOptions}
              iconClassName="material-icons"
              style={{ position: 'relative', top: '7px', padding: '0', left: 0 }}
              iconStyle={{ fontSize: '24px', padding: '3px', borderRadius: '20px', color: '#FFFFFF' }}
            >
              settings
            </IconButton>
          </ToolbarGroup>
        </AppBar>

        <Toolbar style={{ display: this.state.localePopoverOpen ? 'block' : 'none' }}>
          <ToolbarGroup firstChild float="right">
            <ToolbarTitle
              style={{ color: '#fff', padding: '0 0 0 15px', fontSize: '15px' }}
              text={this.intl.trans('choose_lang', 'Choose a Language', 'first')}
            />
            <DropDownMenu value={this.intl.locale} onChange={this._handleChangeLocale} labelStyle={{ color: '#fff' }}>
              <MenuItem value="en" primaryText="English" />
              <MenuItem value="fr" primaryText="Français" />
              {/*<MenuItem value="sp" primaryText="Español" />*/}
            </DropDownMenu>
          </ToolbarGroup>
        </Toolbar>

        <AppLeftNav
          menu={{ main: true }}
          open={false}
          //onRequestChangeLeftNav={this.handleChangeRequestLeftNav}
          //onRequestChangeList={this.handleRequestChangeList}
          docked={false}
        />

        {isDialect && (
          <div className="row" style={{ backgroundColor: themePalette.primary2Color, minHeight: '64px', margin: '0' }}>
            <h2 className="NavigationDialectHeader">
              <a
                href={NavigationHelpers.generateStaticURL(dialectLink)}
                className="NavigationDialectLink"
                onClick={(e) => {
                  e.preventDefault()
                  NavigationHelpers.navigate(dialectLink, this.props.pushWindowPath, false)
                }}
              >
                <Avatar src={avatarSrc} size={50} />
                <span className="NavigationDialectName fontAboriginalSans">
                  {this.intl.searchAndReplace(portalTitle)}
                </span>
              </a>
            </h2>
          </div>
        )}
      </div>
    )
  }

  _removePopoverUnlessOptionSelected = (e) => {
    if (
      this.props.routeParams.hasOwnProperty('dialect_path') &&
      e.target.name !== 'searchTarget' &&
      e.target.name !== 'searchbox'
    ) {
      this.setState({
        searchContextPopoverOpen: false,
      })
    }
  }

  _onNavigateRequest = (path) => {
    this.props.pushWindowPath(path)
  }

  handleChangeRequestLeftNav = (open) => {
    this.setState({
      leftNavOpen: open,
    })
  }

  handleRequestChangeList = () => {
    //this.context.router.push(value);
    this.setState({
      leftNavOpen: false,
    })
  }

  _handleNavigationSearchSubmit = (e) => {
    // If search bar is not visible, this button should show it
    // TODO: this.refs DEPRECATED
    if (this.refs.navigationSearchField._getInputNode().offsetParent === null) {
      this.setState({
        searchBarVisibleInMobile: true,
        searchContextPopoverOpen: false,
      })

      e.preventDefault()
    } else {
      this.setState({
        searchBarVisibleInMobile: false,
        searchContextPopoverOpen: false,
      })

      const searchQueryParam = this.state.searchValue
      const path = '/' + this.props.splitWindowPath.join('/')
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
      if (this.props.routeParams.dialect_path && this.state.searchLocal) {
        queryPath = 'explore' + this.props.routeParams.dialect_path
      }

      // Clear out the input field
      this.setState({ searchValue: '' })

      if (searchQueryParam && searchQueryParam !== '') {
        const finalPath = NavigationHelpers.generateStaticURL(queryPath + '/search/' + searchQueryParam)
        this.props.replaceWindowPath(finalPath)
      }
    }
  }

  _handleDisplayLocaleOptions = () => {
    this.setState({
      localePopoverOpen: true,
    })
  }

  _handleChangeLocale = (e, n, v) => {
    if (v !== this.intl.locale) {
      this.intl.locale = v
      setTimeout(() => {
        // timeout, such that the select box doesn't freeze in a wierd way (looks bad)
        window.location.reload(true)
      }, 250)
    }
  }

  _handleOpenMenuRequest = () => {
    this.props.toggleMenuAction('AppLeftNav')
  }

  _setExplorePath = (props = this.props) => {
    let fetchPath = selectn('routeParams.area', props)

    if (!fetchPath) {
      if (selectn('isConnected', props.computeLogin)) {
        fetchPath = WORKSPACES
      } else {
        fetchPath = SECTIONS
      }
    }

    const pathOrId = '/' + props.properties.domain + '/' + fetchPath

    this.setState({
      pathOrId: pathOrId,
    })
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvPortal, navigation, nuxeo, windowPath } = state

  const { computeDialect2 } = fvDialect
  const { computeLoadNavigation, properties, route } = navigation
  const { computeLogin } = nuxeo
  const { computePortal } = fvPortal
  const { splitWindowPath, _windowPath } = windowPath

  return {
    routeParams: route.routeParams,
    computeDialect2,
    computeLoadNavigation,
    computeLogin,
    computePortal,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  loadNavigation,
  pushWindowPath,
  replaceWindowPath,
  toggleMenuAction,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigation)
