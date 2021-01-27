import React from 'react'
// import PropTypes from 'prop-types'

import './Header.css'
/**
 * @summary HeaderPresentation
 * @version 1.0.1
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function HeaderPresentation({ children }) {
  return (
    <header id="Navigation__header" className="Header Navigation__header">
      <div className="Navigation__toolbar">
        <button
          tabIndex="0"
          onClick={() => {
            window.openMenu()
          }}
          type="button"
          title="Open Menu"
        >
          <span />
          <span />
          <span />
        </button>
        <a id="Navigation__logo_a" href="/home">
          <img className="Navigation__logo" src="assets/images/logo.png" alt="FirstVoices" />
        </a>
        <div id="navigation-toolbar" className="Navigation__toolbarMainInner">
          <div>
            <a className="Navigation__link" href="/explore/FV/sections/Data">
              EXPLORE LANGUAGES
            </a>
            {children}
          </div>
          <form name="searchForm" id="searchForm" action="/explore/FV/sections/Data/search">
            <div className="Navigation__searchContainer Navigation__searchContainer--active">
              <div className="Navigation__searchContainerInner">
                <input
                  aria-invalid="false"
                  aria-label="Search FirstVoices"
                  name="query"
                  placeholder="Search:"
                  type="search"
                />
                <input value="&#x1F50E;" type="submit" tabIndex="0" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </header>
  )
}
// PROPTYPES
// const { string } = PropTypes
HeaderPresentation.propTypes = {
  //   something: string,
}

export default HeaderPresentation
