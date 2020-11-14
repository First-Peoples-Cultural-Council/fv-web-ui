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
        avatarSrc,
        computeLogin,
        dashboardHref,
        dialectHref,
        handleChangeImmersion,
        handleChangeLocale,
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
      }) => {
        return (
          <NavigationBarPresentation
            avatarSrc={avatarSrc}
            computeLogin={computeLogin}
            dashboardHref={dashboardHref}
            dialectHref={dialectHref}
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
