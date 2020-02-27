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

import { withStyles } from '@material-ui/core/styles'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import AppBar from '@material-ui/core/AppBar'
import Avatar from '@material-ui/core/Avatar'
import FVButton from 'views/components/FVButton'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grow from '@material-ui/core/Grow'
import IconButton from '@material-ui/core/IconButton'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

// MAT-UI: Icons
import Clear from '@material-ui/icons/Clear'
import Reorder from '@material-ui/icons/Reorder'
import Search from '@material-ui/icons/Search'
import Settings from '@material-ui/icons/Settings'

import AuthenticationFilter from 'views/components/Document/AuthenticationFilter'
import Login from 'views/components/Navigation/Login'
import AppLeftNav from 'views/components/Navigation/AppLeftNav/index.v2'
import Link from 'views/components/Link'
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
    classes: object, // Mat-ui
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

    this.navigationSearchField = null

    this.state = {
      searchPopoverOpen: false,
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
        searchPopoverOpen: false,
      })
    }
  }

  componentDidMount() {
    this._setExplorePath()

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

    const { classes } = this.props
    const { appBarIcon = {}, appBar = {}, dialectContainer = {}, localePicker = {} } = classes

    return (
      <AppBar position="static" color="primary" className="Navigation" classes={{ colorPrimary: appBar }}>
        <Toolbar disableGutters className="Navigation__toolbarMain">
          {/* Menu Button */}
          <Tooltip title="Menu open">
            <IconButton
              onClick={this._handleOpenMenuRequest}
              className="Navigation__open"
              data-testid="Navigation__open"
            >
              <Reorder className={appBarIcon} aria-label="Menu open" />
            </IconButton>
          </Tooltip>

          {/* Menu */}
          <AppLeftNav menu={{ main: true }} open={false} docked={false} />

          {/* Logo */}
          <Link href="/home">
            <img className="Navigation__logo" src="assets/images/logo.png" alt={this.props.properties.title} />
          </Link>

          <div className="Navigation__toolbarMainInner">
            <Link href={hrefPath} className={`${appBar} Navigation__link hideSmall`}>
              {this.intl.translate({ key: 'general.explore', default: 'Explore Languages', case: 'upper' })}
            </Link>

            <Login
              routeParams={this.props.routeParams}
              label={this.intl.translate({
                key: 'views.pages.users.login.sign_in',
                default: 'Sign In',
                case: 'words',
              })}
              className={appBar}
            />

            <div className="Navigation__separator" />

            <AuthenticationFilter
              login={this.props.computeLogin}
              anon={false}
              routeParams={this.props.routeParams}
              containerStyle={{ display: 'inline' }}
            >
              <Link href={NavigationHelpers.generateStaticURL('/tasks')} className={`${appBar} Navigation__link`}>
                View My Tasks
              </Link>
            </AuthenticationFilter>
            <div className="Navigation__separator" />

            {/* Search Container */}
            <ClickAwayListener
              onClickAway={() => {
                this.setState({
                  searchPopoverOpen: false,
                })
              }}
            >
              <div
                className={`Navigation__searchContainer ${
                  this.state.searchPopoverOpen ? 'Navigation__searchContainer--active' : ''
                } ${appBar}`}
                onFocus={() => {
                  this.setState({
                    searchPopoverOpen: true,
                  })
                }}
              >
                <div className="Navigation__searchContainerInner">
                  {/* Search: Input */}
                  <TextField
                    className={`Navigation__searchInput ${getDialectClassname()}`}
                    inputRef={(element) => {
                      this.navigationSearchField = element
                    }}
                    placeholder={this.intl.translate({
                      key: 'general.search',
                      default: 'Search',
                      case: 'first',
                      append: ':',
                    })}
                    onFocus={() => {
                      this.setState({
                        searchPopoverOpen: true,
                      })
                    }}
                    onChange={(e) => {
                      this.setState({ searchValue: e.target.value })
                    }}
                    value={this.state.searchValue}
                    onKeyDown={(e) => {
                      if (e.keyCode === 13) {
                        this._handleNavigationSearchSubmit(e)
                      }
                    }}
                    name="searchbox"
                  />

                  {/* Search Button: Submit */}
                  <Tooltip title="Search">
                    <IconButton
                      type="button"
                      data-testid="Navigation__search"
                      onClick={this._handleNavigationSearchSubmit}
                    >
                      <Search className={appBarIcon} aria-label="Search" />
                    </IconButton>
                  </Tooltip>

                  {/* Search Button: Cancel (only on small screens) */}
                  <span className="hideLarge">
                    <FVButton
                      variant="flat"
                      onClick={(e) => {
                        e.preventDefault()
                        // this.navigationSearchButton.focus()
                        this.setState({ searchPopoverOpen: false })
                      }}
                      className={appBar}
                    >
                      {this.intl.translate({ key: 'general.cancel', default: 'Cancel', case: 'first' })}
                    </FVButton>
                  </span>
                </div>

                <div
                  className="Navigation__searchPopupContainer"
                  tabIndex={-1}
                  onFocus={() => {
                    this.setState(
                      {
                        searchPopoverOpen: true,
                      },
                      () => {}
                    )
                  }}
                  onBlur={() => {
                    this.setState({
                      searchPopoverOpen: false,
                    })
                  }}
                >
                  <Grow mountOnEnter unmountOnExit in={this.state.searchPopoverOpen}>
                    {/* Search Popup Menu */}
                    <div className={`Navigation__searchPopup ${isDialect ? 'Navigation__searchPopup--dialect' : ''}`}>
                      {isDialect ? this.popoverContentDialect() : this.popoverContent()}
                    </div>
                  </Grow>
                </div>
              </div>
            </ClickAwayListener>

            {/* Search Button: Open drawer (only on small screens) */}
            <span className="hideLarge">
              <Tooltip title="Search">
                <IconButton type="button" data-testid="Navigation__search" onClick={this.showSearchPopup}>
                  <Search className={appBarIcon} aria-label="Search" />
                </IconButton>
              </Tooltip>
            </span>

            <div className="Navigation__separator" />

            {/* Locale Button */}
            <Tooltip title="Settings">
              <IconButton type="button" onClick={this._toggleDisplayLocaleOptions}>
                <Settings className={appBarIcon} aria-label="Settings" />
              </IconButton>
            </Tooltip>
          </div>
        </Toolbar>

        {/* Locale Container */}
        <div
          className={`Navigation__localeContainer ${
            this.state.localePopoverOpen ? 'Navigation__localeContainer--open' : ''
          } ${localePicker}`}
        >
          <Toolbar>
            <div className="Navigation__localeInner">
              <Typography variant="body1" className={`${localePicker} Navigation__localeTitle`}>
                {this.intl.trans('choose_lang', 'Choose a Language', 'first')}
              </Typography>
              <FormControl>
                <InputLabel htmlFor="locale-select" className={`${localePicker}`}>
                  Language
                </InputLabel>
                <Select
                  value={this.intl.locale || 'en'}
                  onChange={(event) => {
                    this._handleChangeLocale(event.target.value)
                  }}
                  className={localePicker}
                  inputProps={{
                    name: 'locale',
                    id: 'locale-select',
                  }}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="fr">Français</MenuItem>
                </Select>
              </FormControl>

              <IconButton type="button" onClick={this._toggleDisplayLocaleOptions}>
                <Clear className={appBarIcon} aria-label="Close" />
              </IconButton>
            </div>
          </Toolbar>
        </div>

        {/* Dialect sub-menu */}
        {isDialect && (
          <div className={`row Navigation__dialectContainer ${dialectContainer}`}>
            <h2 className="Navigation__dialectHeader">
              <Link
                href={NavigationHelpers.generateStaticURL(dialectLink)}
                className={`${dialectContainer} Navigation__dialectLink`}
              >
                <Avatar src={avatarSrc} size={50} />
                <span className="Navigation__dialectName fontAboriginalSans">
                  {this.intl.searchAndReplace(portalTitle)}
                </span>
              </Link>
            </h2>
          </div>
        )}
      </AppBar>
    )
  }
  showSearchPopup = (e) => {
    e.preventDefault()

    this.setState(
      {
        searchPopoverOpen: true,
      },
      () => {
        this.navigationSearchField.focus()
      }
    )
  }
  _handleNavigationSearchSubmit = (e) => {
    // If searched w/nothing focus on input and don't continue
    if (this.state.searchValue === '') {
      this.showSearchPopup(e)
      return
    }
    this.setState({
      searchPopoverOpen: false,
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

  _toggleDisplayLocaleOptions = () => {
    this.setState({
      localePopoverOpen: !this.state.localePopoverOpen,
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
  popoverContent = () => {
    return (
      <div className="Navigation__popoverInner">
        <Typography variant="title">
          {this.intl.translate({
            key: 'views.components.navigation.search_all',
            default: 'Search all languages & words at FirstVoices.com',
            case: 'first',
          })}
        </Typography>
      </div>
    )
  }
  popoverContentDialect = () => {
    return (
      <div className="Navigation__popoverInner">
        <Typography variant="body1" gutterBottom>
          {this.intl.translate({
            key: 'general.select_search_option',
            default: 'Select Search Option',
            case: 'words',
          })}
        </Typography>

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
                <Typography variant="body1" gutterBottom>
                  FirstVoices.com
                </Typography>
                <Typography variant="caption" gutterBottom>
                  {this.intl.translate({
                    key: 'views.components.navigation.all_languages_and_words',
                    default: 'All languages & words',
                    case: 'words',
                    append: '.',
                  })}
                </Typography>
              </div>
            }
          />

          <FormControlLabel
            value="local"
            control={<Radio />}
            label={
              <div>
                <Typography variant="body1" gutterBottom>
                  {selectn('routeParams.dialect_name', this.props) ||
                    this.intl.translate({
                      key: 'views.components.navigation.this_dialect',
                      default: 'This Dialect',
                      case: 'words',
                    })}
                </Typography>
                <Typography variant="caption" gutterBottom>
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
                </Typography>
              </div>
            }
          />
        </RadioGroup>
      </div>
    )
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

const styles = (theme) => {
  const { appBar, appBarIcon, dialectContainer, localePicker } = theme
  return {
    appBar,
    appBarIcon,
    dialectContainer,
    localePicker,
  }
}
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Navigation))
