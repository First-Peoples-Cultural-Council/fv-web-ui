import React, { useRef } from 'react'
import PropTypes from 'prop-types'

// MAT-UI: Core
import { makeStyles } from '@material-ui/core/styles'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import AppBar from '@material-ui/core/AppBar'
import Avatar from '@material-ui/core/Avatar'
import FVButton from 'components/FVButton'
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
import Switch from '@material-ui/core/Switch'

// MAT-UI: Icons
import Clear from '@material-ui/icons/Clear'
import Reorder from '@material-ui/icons/Reorder'
import Search from '@material-ui/icons/Search'
import TranslateIcon from '@material-ui/icons/Translate'

// FPCC
import { getDialectClassname } from 'common/Helpers'

import AppLeftNav from 'components/AppLeftNav/index.v2'
import AuthenticationFilter from 'components/AuthenticationFilter'
import FVLabel from 'components/FVLabel'
import Link from 'components/Link'
import Login from 'components/Login'

import '!style-loader!css-loader!./NavigationBar.css'
/**
 * @summary NavigationBarPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function NavigationBarPresentation({
  portalLogoSrc,
  computeLogin,
  currentImmersionMode,
  currentLocale,
  dashboardHref,
  dialectHref,
  handleChangeImmersion,
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
  searchLocation,
  searchPopoverOpen,
  searchValue,
  toggleDisplayLocaleOptions,
}) {
  const classes = useStyles()
  const { appBarIcon, appBar, dialectContainer, localePicker, immersionSwitch } = classes

  const popoverContent = () => {
    return (
      <div className="Navigation__popoverInner">
        <Typography variant="h6">
          <FVLabel
            transKey="views.components.navigation.search_all"
            defaultStr="Search all languages on FirstVoices.com"
            transform="first"
          />
        </Typography>
      </div>
    )
  }
  const popoverContentDialect = () => {
    return (
      <div className="Navigation__popoverInner">
        <Typography variant="body2" gutterBottom>
          <FVLabel transKey="general.select_search_option" defaultStr="Select Search Option" transform="words" />
        </Typography>

        <RadioGroup onChange={handleChangeSearchLocation} name="searchTarget" value={searchLocation}>
          <FormControlLabel
            value={intl.translate({
              key: 'general.all',
              default: 'all',
              case: 'lower',
            })}
            control={<Radio />}
            label={
              <div>
                <Typography variant="body2" gutterBottom>
                  FirstVoices.com
                </Typography>
                <Typography variant="caption" gutterBottom>
                  <FVLabel
                    transKey="views.components.navigation.all_languages_and_words"
                    defaultStr="All languages & words"
                    transform="words"
                    append="."
                  />
                </Typography>
              </div>
            }
          />

          <FormControlLabel
            value="local"
            control={<Radio />}
            label={
              <div>
                <Typography variant="body2" gutterBottom>
                  {routeParams.dialect_name || (
                    <FVLabel
                      transKey="views.components.navigation.this_dialect"
                      defaultStr="This Dialect"
                      transform="words"
                    />
                  )}
                </Typography>
                <Typography variant="caption" gutterBottom>
                  <FVLabel transKey="general.words" defaultStr="'Words" case="first" />,
                  <FVLabel transKey="general.phrases" defaultStr="'Phrases" case="first" />,
                  <FVLabel
                    transKey="general.songs_and_stories"
                    defaultStr="'Songs &amp; Stories"
                    case="words"
                    append="."
                  />
                </Typography>
              </div>
            }
          />
        </RadioGroup>
      </div>
    )
  }

  const navigationSearchField = useRef(null)

  return (
    <AppBar position="static" color="primary" className="Navigation" classes={{ colorPrimary: appBar }}>
      <Toolbar disableGutters className="Navigation__toolbarMain">
        {/* Menu Button */}
        <Tooltip title="Menu open">
          <IconButton onClick={handleOpenMenuRequest} className="Navigation__open" data-testid="Navigation__open">
            <Reorder className={appBarIcon} aria-label="Menu open" />
          </IconButton>
        </Tooltip>

        {/* Menu */}
        <AppLeftNav menu={{ main: true }} open={false} docked={false} />

        {/* Logo */}
        <Link href="/home">
          <img className="Navigation__logo" src="assets/images/logo.png" alt="Navigation logo" />
        </Link>

        <div className="Navigation__toolbarMainInner">
          <Link href="/explore/FV/sections/Data" className={`${appBar} Navigation__link hideSmall`}>
            <FVLabel transKey="general.explore" defaultStr="Explore Languages" transform="upper" />
          </Link>

          <Login routeParams={routeParams} className={appBar} />

          <div className="Navigation__separator" />

          <AuthenticationFilter
            login={computeLogin}
            anon={false}
            routeParams={routeParams}
            containerStyle={{ display: 'inline' }}
          >
            <Link href={dashboardHref} className={`${appBar} Navigation__link`}>
              Dashboard
            </Link>
          </AuthenticationFilter>
          <div className="Navigation__separator" />

          {/* Search Container */}
          <ClickAwayListener onClickAway={handleSearchPopoverClose}>
            <div
              className={`Navigation__searchContainer ${
                searchPopoverOpen ? 'Navigation__searchContainer--active' : ''
              } ${appBar}`}
              onFocus={handleSearchPopoverOpen}
            >
              <div className="Navigation__searchContainerInner">
                {/* Search: Input */}
                <TextField
                  className={`Navigation__searchInput ${getDialectClassname}`}
                  ref={navigationSearchField}
                  placeholder={intl.translate({
                    key: 'general.search',
                    default: 'Search',
                    case: 'first',
                    append: ':',
                  })}
                  onFocus={handleSearchPopoverOpen}
                  onChange={handleSearchTextFieldChange}
                  value={searchValue}
                  onKeyDown={(e) => {
                    if (e.keyCode === 13 && searchValue !== '') {
                      handleNavigationSearchSubmit(e)
                    }
                  }}
                  name="searchbox"
                />

                {/* Search Button: Submit */}
                <Tooltip title="Search">
                  <IconButton
                    type="button"
                    data-testid="Navigation__search"
                    onClick={(e) => {
                      if (searchValue !== '') {
                        handleNavigationSearchSubmit(e)
                      } else navigationSearchField.current.focus()
                    }}
                  >
                    <Search className={appBarIcon} aria-label="Search" />
                  </IconButton>
                </Tooltip>

                {/* Search Button: Cancel (only on small screens) */}
                <span className="hideLarge">
                  <FVButton variant="text" onClick={handleSearchPopoverOpen} className={appBar}>
                    <FVLabel transKey="general.cancel" defaultStr="Cancel" transform="first" />
                  </FVButton>
                </span>
              </div>

              <div
                className="Navigation__searchPopupContainer"
                tabIndex={-1}
                onFocus={handleSearchPopoverOpen}
                onBlur={handleSearchPopoverClose}
              >
                <Grow mountOnEnter unmountOnExit in={searchPopoverOpen}>
                  {/* Search Popup Menu */}
                  <div className={`Navigation__searchPopup ${isDialect ? 'Navigation__searchPopup--dialect' : ''}`}>
                    {isDialect ? popoverContentDialect() : popoverContent()}
                  </div>
                </Grow>
              </div>
            </div>
          </ClickAwayListener>

          {/* Search Button: Open drawer (only on small screens) */}
          <span className="hideLarge">
            <Tooltip title="Search">
              <IconButton
                type="button"
                data-testid="Navigation__search"
                onClick={() => {
                  navigationSearchField.current.focus()
                  handleSearchPopoverOpen()
                }}
              >
                <Search className={appBarIcon} aria-label="Search" />
              </IconButton>
            </Tooltip>
          </span>

          <div className="Navigation__separator" />

          {/* Locale Button */}
          <Tooltip title="Language Settings">
            <IconButton type="button" onClick={toggleDisplayLocaleOptions}>
              <TranslateIcon className={appBarIcon} aria-label="Language Settings" />
            </IconButton>
          </Tooltip>
        </div>
      </Toolbar>

      {/* Locale Container */}
      <div
        className={`Navigation__localeContainer ${
          localePopoverOpen ? 'Navigation__localeContainer--open' : ''
        } ${localePicker}`}
      >
        <Toolbar>
          <div className="Navigation__localeInner">
            <div className="Navigation__immersionSwitch">
              <FormControlLabel
                control={
                  <Switch
                    checked={currentImmersionMode}
                    onChange={handleChangeImmersion}
                    classes={{
                      switchBase: immersionSwitch,
                    }}
                  />
                }
                classes={{
                  label: immersionSwitch,
                }}
                label="Immersion Mode"
              />
            </div>
            {/* <FormControl>
                <InputLabel>
                  Immersion Mode
                </InputLabel>
                <Switch checked={currentImmersionMode === 1} onChange={() => handleChangeImmersion()} /> */}
            {/* <Select
                  value={currentImmersionMode}
                  onChange={(event) => {
                    handleChangeImmersion(event.target.value)
                  }}
                  className={localePicker}
                  inputProps={{
                    name: 'locale',
                    id: 'locale-select',
                  }}
                >
                  <MenuItem value={0}>None</MenuItem>
                  <MenuItem value={1}>Immersive</MenuItem>
                  <MenuItem value={2}>Both Languages</MenuItem>
                </Select> */}
            {/* </FormControl> */}
            <Typography variant="body2" className={`${localePicker} Navigation__localeTitle`}>
              <FVLabel transKey="choose_lang" defaultStr="Choose a language" transform="first" />
            </Typography>
            <FormControl>
              <InputLabel htmlFor="locale-select" className={`${localePicker}`}>
                Language
              </InputLabel>
              <Select
                value={currentLocale}
                onChange={handleChangeLocale}
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

            <IconButton type="button" onClick={toggleDisplayLocaleOptions}>
              <Clear className={appBarIcon} aria-label="Close" />
            </IconButton>
          </div>
        </Toolbar>
      </div>

      {/* Dialect Header */}
      {isDialect && (
        <div className={`row Navigation__dialectContainer ${dialectContainer}`}>
          <h2 className="Navigation__dialectHeader">
            <Link href={dialectHref} className={`${dialectContainer} Navigation__dialectLink`}>
              <Avatar src={portalLogoSrc} size={50} />
              <span className="Navigation__dialectName fontBCSans">{intl.searchAndReplace(portalTitle)}</span>
            </Link>
          </h2>
        </div>
      )}
    </AppBar>
  )
}

const useStyles = makeStyles((theme) => ({
  appBar: theme.appbar,
  appBarIcon: theme.appBarIcon,
  dialectContainer: theme.dialectContainer,
  localePicker: theme.localePicker,
  immersionSwitch: theme.immersionSwitch,
}))

// PROPTYPES
const { bool, func, object, string } = PropTypes
NavigationBarPresentation.propTypes = {
  portalLogoSrc: string,
  computeLogin: object,
  currentLocale: string,
  currentImmersionMode: bool,
  dashboardHref: string,
  dialectHref: string,
  handleChangeImmersion: func,
  handleChangeLocale: func,
  handleChangeSearchLocation: func,
  handleNavigationSearchSubmit: func,
  handleOpenMenuRequest: func,
  handleSearchPopoverClose: func,
  handleSearchPopoverOpen: func,
  handleSearchTextFieldChange: func,
  intl: object,
  isDialect: bool,
  localePopoverOpen: bool,
  portalTitle: string,
  routeParams: object,
  searchLocation: string,
  searchPopoverOpen: bool,
  searchValue: string,
  toggleDisplayLocaleOptions: func,
}

export default NavigationBarPresentation
