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

// MAT-UI: Core
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import Popover from '@material-ui/core/Popover'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import Toolbar from '@material-ui/core/Toolbar/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

// MAT-UI: Icons
import Reorder from '@material-ui/icons/Reorder'
import Search from '@material-ui/icons/Search'
import Settings from '@material-ui/icons/Settings'

import AuthenticationFilter from 'views/components/Document/AuthenticationFilter'

import Login from 'views/components/Navigation/Login'
import AppLeftNav from 'views/components/Navigation/AppLeftNav/index.v2'

import IntlService from 'views/services/intl'

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

    this.navigationSearchField = React.createRef()

    this.state = {
      searchBarVisibleInMobile: false,
      searchContextPopoverOpen: false,
      searchContextPopoverAnchorEl: null,
      searchLocation: 'local',
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
    const computeDialect = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)
    const portalTitle =
      selectn('response.contextParameters.ancestry.dialect.dc:title', computePortal) ||
      selectn('response.properties.dc:title', computeDialect)
    // V2:
    // const portalTitle = this.props.routeParams.dialect_name || ''

    const dialectLink = '/explore' + this.props.routeParams.dialect_path
    const hrefPath = NavigationHelpers.generateDynamicURL('page_explore_dialects', this.props.routeParams)

    const themePalette = this.props.properties.theme.v0.palette
    const _backgroundColor = selectn('properties.theme.palette.primary.main', this.props)
    const backgroundColor = _backgroundColor ? _backgroundColor : 'transparent'
    const color = selectn('properties.theme.palette.primary.contrastText', this.props)

    return (
      <div
        className="Navigation"
        style={{
          backgroundColor,
          color,
        }}
      >
        <Toolbar>
          <Tooltip title="Menu open">
            <IconButton onClick={this._handleOpenMenuRequest}>
              <Reorder aria-label="Menu open" />
            </IconButton>
          </Tooltip>
          <span className="hidden-xs">
            <img src="assets/images/logo.png" style={{ padding: '0 0 5px 0' }} alt={this.props.properties.title} />
          </span>
          <div style={{ position: 'relative', color: '#fff' }}>
            <div
              style={{ display: 'inline-block', paddingRight: '10px', paddingTop: '15px', textTransform: 'uppercase' }}
            >
              <a
                href={hrefPath}
                className="Navigation__link nav_link hidden-xs"
                onClick={(e) => {
                  e.preventDefault()
                  NavigationHelpers.navigate(hrefPath, this.props.pushWindowPath, false)
                }}
              >
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

            <div
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
                    // iconStyle={{ fill: "#fff" }}
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

            <div className="search-bar-seperator" style={{ float: 'none', marginRight: 0, marginLeft: 10 }} />

            <div
              style={{ background: themePalette.primary1Color, display: 'inline-block' }}
              className={classNames({
                'hidden-xs': !this.state.searchBarVisibleInMobile,
                'search-bar-mobile': this.state.searchBarVisibleInMobile,
              })}
            >
              <TextField
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
                inputRef={this.navigationSearchField}
                // hintText={this.intl.translate({ key: 'general.search', default: 'Search', case: 'first', append: ':' })}
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
              <Button
                className={classNames({ hidden: !this.state.searchBarVisibleInMobile })}
                style={{ color: themePalette.alternateTextColor }}
                onClick={(e) => {
                  this.setState({ searchBarVisibleInMobile: false })
                  e.preventDefault()
                }}
              >
                {this.intl.translate({ key: 'general.cancel', default: 'Cancel', case: 'first' })}
              </Button>
            </div>
            <Tooltip title="Search">
              <IconButton
                type="button"
                className="Navigation__btn"
                data-testid="Navigation__search"
                onClick={this._handleNavigationSearchSubmit}
              >
                <Search aria-label="Search" />
              </IconButton>
            </Tooltip>

            {this._getPopover()}

            <div className="locale-seperator" style={{ float: 'none', marginRight: 0, marginLeft: 0 }} />
            <Tooltip title="Settings">
              <IconButton type="button" onClick={this._handleDisplayLocaleOptions}>
                <Settings aria-label="Settings" />
              </IconButton>
            </Tooltip>
          </div>
        </Toolbar>

        <Toolbar style={{ display: this.state.localePopoverOpen ? 'block' : 'none' }}>
          <div float="right">
            <Typography variant="title" style={{ color: '#fff', padding: '0 0 0 15px', fontSize: '15px' }}>
              {this.intl.trans('choose_lang', 'Choose a Language', 'first')}
            </Typography>
            <Select
              value={this.intl.locale || 'en'}
              onChange={(event) => {
                this._handleChangeLocale(event.target.value)
              }}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="fr">Français</MenuItem>
              {/* <MenuItem value="sp">Español</MenuItem> */}
            </Select>
          </div>
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
  _getPopover = () => {
    const isDialect = this.props.routeParams.hasOwnProperty('dialect_path')
    const popoverContent = isDialect ? (
      <div className="Navigation__popoverInner">
        <h2>
          {this.intl.translate({
            key: 'general.select_search_option',
            default: 'Select Search Option',
            case: 'words',
          })}
        </h2>

        <div>
          <RadioGroup
            onChange={(event, value) => {
              this.setState({ searchLocation: value })
            }}
            name="searchTarget"
            value={this.state.searchLocation}
          >
            <FormControlLabel
              value={this.intl.translate({
                key: 'general.all',
                default: 'all',
                case: 'lower',
              })}
              control={<Radio />}
              label={
                <div>
                  <h3>FirstVoices.com</h3>
                  <p
                  // style={{
                  //   fontWeight: '300',
                  //   color: '#959595',
                  // }}
                  >
                    {this.intl.translate({
                      key: 'views.components.navigation.all_languages_and_words',
                      default: 'All languages & words',
                      case: 'words',
                      append: '.',
                    })}
                  </p>
                </div>
              }
            />
            <FormControlLabel
              value="local"
              control={<Radio />}
              label={
                <div>
                  <h3>
                    {selectn('routeParams.dialect_name', this.props) ||
                      this.intl.translate({
                        key: 'views.components.navigation.this_dialect',
                        default: 'This Dialect',
                        case: 'words',
                      })}
                  </h3>
                  <div
                  // style={{
                  //   fontWeight: '300',
                  //   color: '#959595',
                  // }}
                  >
                    {`${this.intl.translate({
                      key: 'general.words',
                      default: 'Words',
                      case: 'first',
                    })}, ${this.intl.translate({
                      key: 'general.phrases',
                      default: 'Phrases',
                      case: 'first',
                    })}, ${this.intl.translate({
                      key: 'general.songs_and_stories',
                      default: 'Songs &amp; Stories',
                      case: 'words',
                      append: '.',
                    })}`}
                  </div>
                </div>
              }
            />
          </RadioGroup>
        </div>
      </div>
    ) : (
      <div className="Navigation__popoverInner">
        <Typography variant="headline">
          {this.intl.translate({
            key: 'views.components.navigation.search_all',
            default: 'Search all languages & words at FirstVoices.com',
            case: 'first',
          })}
        </Typography>
      </div>
    )

    return (
      <Popover
        anchorEl={this.state.searchContextPopoverAnchorEl}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        open={this.state.searchContextPopoverOpen}
        style={{
          maxWidth: isDialect ? '320px' : '220px',
        }}
        // transformOrigin={{ horizontal: 'middle', vertical: 'top' }}
        useLayerForClickAway={false}
      >
        {popoverContent}
      </Popover>
    )
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
      if (this.props.routeParams.dialect_path && this.state.searchLocation === 'local') {
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

  _handleChangeLocale = (value) => {
    if (value !== this.intl.locale) {
      this.intl.locale = value
      setTimeout(() => {
        // timeout, such that the select box doesn't freeze in a wierd way (looks bad)
        window.location.reload(true)
      }, 250)
    }
  }

  _handleOpenMenuRequest = () => {
    this.props.toggleMenuAction()
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
