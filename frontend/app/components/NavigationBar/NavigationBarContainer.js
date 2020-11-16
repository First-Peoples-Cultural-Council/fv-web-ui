import React from 'react'
// import PropTypes from 'prop-types'
import NavigationBarPresentation from 'components/NavigationBar/NavigationBarPresentation'
import NavigationBarData from 'components/NavigationBar/NavigationBarData'

/**
 * @summary NavigationBarContainer
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function NavigationBarContainer() {
  return (
    <NavigationBarData>
      {({
        portalLogoSrc,
        computeLogin,
        currentImmersionMode,
        currentLocale,
        dashboardHref,
        dialectHref,
        handleChangeImmersion,
        handleChangeLocale,
        handleNavigationSearchSubmit,
        handleOpenMenuRequest,
        handleChangeSearchLocation,
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
      }) => {
        return (
          <NavigationBarPresentation
            portalLogoSrc={portalLogoSrc}
            computeLogin={computeLogin}
            currentImmersionMode={currentImmersionMode}
            currentLocale={currentLocale}
            dashboardHref={dashboardHref}
            dialectHref={dialectHref}
            handleChangeSearchLocation={handleChangeSearchLocation}
            handleChangeImmersion={handleChangeImmersion}
            handleChangeLocale={handleChangeLocale}
            handleNavigationSearchSubmit={handleNavigationSearchSubmit}
            handleOpenMenuRequest={handleOpenMenuRequest}
            handleSearchPopoverClose={handleSearchPopoverClose}
            handleSearchPopoverOpen={handleSearchPopoverOpen}
            handleSearchTextFieldChange={handleSearchTextFieldChange}
            intl={intl}
            isDialect={isDialect}
            localePopoverOpen={localePopoverOpen}
            portalTitle={portalTitle}
            routeParams={routeParams}
            searchLocation={searchLocation}
            searchPopoverOpen={searchPopoverOpen}
            searchValue={searchValue}
            toggleDisplayLocaleOptions={toggleDisplayLocaleOptions}
          />
        )
      }}
    </NavigationBarData>
  )
}
// PROPTYPES
// const { string } = PropTypes
NavigationBarContainer.propTypes = {
  //   something: string,
}

export default NavigationBarContainer
