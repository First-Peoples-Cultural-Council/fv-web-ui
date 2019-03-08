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
import React, { Component, PropTypes } from "react"
import ReactDOM from "react-dom"
import provide from "react-redux-provide"
import selectn from "selectn"

import classNames from "classnames"

import ProviderHelpers from "common/ProviderHelpers"
import StringHelpers from "common/StringHelpers"
import UIHelpers from "common/UIHelpers"

import AuthorizationFilter from "views/components/Document/AuthorizationFilter"

import AppFrontController from "./AppFrontController"

import Shepherd from "tether-shepherd"

import FontIcon from "material-ui/lib/font-icon"
import Paper from "material-ui/lib/paper"
import FlatButton from "material-ui/lib/flat-button"

import IntlService from "views/services/intl"

const getPosition = function getPosition() {
  var doc = document,
    w = window
  var x, y, docEl

  if (typeof w.pageYOffset === "number") {
    x = w.pageXOffset
    y = w.pageYOffset
  } else {
    docEl = doc.compatMode && doc.compatMode === "CSS1Compat" ? doc.documentElement : doc.body
    x = docEl.scrollLeft
    y = docEl.scrollTop
  }
  return { x: x, y: y }
}

/**
 * Finds the xPath for a component, leading up to the 'app-wrapper'.
 * Used as a utility for creating Shepherd tours
 */
function findComponentParents(el) {
  let parents = []
  let originalEl = el

  if (!el.getAttribute("data-component-id")) {
    return null
  }

  while (el.parentNode) {
    el = el.parentNode

    if (el.getAttribute("id") === "app-wrapper") {
      break
    }

    if (el.tagName) {
      let appendClass = el.className ? "." + el.className.replace(/\s/g, ".").replace(/\:/g, "\\:") : ""
      let appendData = el.getAttribute("data-component-id")
        ? "[data-component-id='" + el.getAttribute("data-component-id") + "']"
        : ""

      parents.push(el.tagName.toLowerCase() + appendClass + appendData)
    }
  }

  parents = parents.reverse()
  parents.push(
    originalEl.tagName.toLowerCase() + "[data-component-id='" + originalEl.getAttribute("data-component-id") + "']"
  )

  return parents.join(" ")
}

const getPreferences = function(login, dialect) {
  let preferenceString = selectn("response.properties.preferences", login)
  let parsedPreferences = preferenceString ? JSON.parse(preferenceString) : {}
  let flattenedPreferences = {}

  for (var preferenceCat in parsedPreferences) {
    for (var preference in parsedPreferences[preferenceCat]) {
      flattenedPreferences[preference] = parsedPreferences[preferenceCat][preference]
    }
  }

  // Dialect assignment
  flattenedPreferences["primary_dialect_path"] = selectn("path", dialect)

  return flattenedPreferences
}

@provide
export default class AppWrapper extends Component {
  intl = IntlService.instance
  intlBaseKey = "views"

  static propTypes = {
    connect: PropTypes.func.isRequired,
    getCurrentUser: PropTypes.func.isRequired,
    fetchDialect2: PropTypes.func.isRequired,
    computeDialect2: PropTypes.object.isRequired,
    queryDialect2: PropTypes.func.isRequired,
    computeDialect2Query: PropTypes.object.isRequired,
    computeLogin: PropTypes.object.isRequired,
    windowPath: PropTypes.string.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    changeTheme: PropTypes.func.isRequired,
    properties: PropTypes.object.isRequired,
  }

  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }

  // react-redux-provide will pass context such as providers (Note: this is only needed for debugging the store atm)
  static contextTypes = {
    providers: PropTypes.object,
  }

  /**
   * Pass essential context to all children
   */
  getChildContext() {
    let newContext = {
      muiTheme: this.props.properties.theme.palette,
    }

    return newContext
  }

  constructor(props, context) {
    super(props, context)

    // Connect to Nuxeo
    this.props.connect()
    this.props.getCurrentUser()

    this.state = {
      adminGuideStarted: false,
      dialect: null,
    }

    // Bind methods to 'this'
    ;["_startAdminGuideAssist"].forEach((method) => (this[method] = this[method].bind(this)))
  }

  // Force update of theme if out of sync
  // This is a fix that may be unecessary in future versions of Material-UI, React, Reat-redux-provide
  componentWillReceiveProps(nextProps) {
    if (nextProps.properties.theme.id != this.props.properties.theme.id) {
      nextProps.changeTheme(nextProps.properties.theme.id)
    }
  }

  // Changing a theme manually...
  /*_changeTheme(event) {
      let index = event.nativeEvent.target.selectedIndex;
      this.props.changeTheme(event.target[index].value);
    }*/

  _startAdminGuideAssist() {
    let doms = document.querySelectorAll("[data-component-id]")

    let tour = new Shepherd.Tour({
      defaults: {
        classes: "shepherd-theme-arrows",
      },
    })

    document.onkeydown = function(e) {
      e = e || window.event
      switch (e.which || e.keyCode) {
        case 37:
          tour.back()
          break

        case 39:
          tour.next()
          break
      }
    }

    doms.forEach(function(dom, i) {
      let xpath = findComponentParents(dom)

      //if (!document.querySelector(xpath)) {
      //  console.log(xpath);
      //}

      if (xpath != null) {
        tour.addStep("step" + i, {
          title: "Element xPath",
          text: xpath + "<textarea>" + dom.textContent + "</textarea>",
          classes: "shepherd-theme-arrows admin-guide-step",
          attachTo: xpath + " bottom",
          showCancelLink: true,
          scrollTo: true,
          when: {
            show: function() {
              dom.style.border = "2px blue dashed"
            },
            hide: function() {
              dom.style.border = "initial"
            },
          },
        })
      }
    })

    this.setState({
      adminGuideStarted: true,
    })

    tour.start()
  }

  render() {
    const dialectQuery = ProviderHelpers.getEntry(this.props.computeDialect2Query, "/FV/Workspaces")

    let controller = null

    const computeDialect2 = !this.state.dialect
      ? null
      : ProviderHelpers.getEntry(this.props.computeDialect2, this.state.dialect)
    let primaryDialectSearchQuery = selectn("response.entries", dialectQuery)

    let warnings = {}

    let autoPrimaryDialect

    // If primary dialect was found manually
    if (primaryDialectSearchQuery && primaryDialectSearchQuery.length > 0) {
      autoPrimaryDialect = primaryDialectSearchQuery[0]

      if (primaryDialectSearchQuery.length > 1) {
        warnings["multiple_dialects"] = (
          <span>
            <strong>
              {this.intl.translate({
                key: "note",
                default: "Note",
                case: "first",
              })}
              :
            </strong>{" "}
            {this.intl.translate({
              key: "your_a_member_of_more_than_one_dialect",
              default: "You're a member of more than one dialect",
              case: "first",
            })}
            .{" "}
            <a href="/profile">
              {this.intl.translate({
                key: "configure_or_select_primary_dialect",
                default: "Please configure a primary dialect or select a default starting page",
                case: "first",
              })}
              .
            </a>
          </span>
        )
      }
    }

    let preferences = getPreferences(
      this.props.computeLogin,
      selectn("response", computeDialect2) || autoPrimaryDialect
    )

    return (
      <div
        style={{ backgroundColor: selectn("theme.palette.basePalette.wrapper.backgroundColor", this.props.properties) }}
        style={{ fontSize: UIHelpers.getPreferenceVal("font_size", preferences) }}
      >
        <AppFrontController preferences={preferences} warnings={warnings} />

        {/*<AuthorizationFilter filter={{
                role: ['Everything'],
                entity: selectn('response.entries[0]', dialects),
                login: this.props.computeLogin
            }}>
                <div className="row" style={{backgroundColor: '#406f85', textAlign: 'center', color: '#8caab8'}}>

                    {this.intl.translate({
                        key: 'super_admin_tools',
                        default: 'Super Admin Tools',
                        case: 'words'
                    })}: <FlatButton onTouchTap={this._startAdminGuideAssist.bind(this.props.windowPath)}
                                     disabled={this.state.adminGuideStarted} label={this.intl.translate({
                    key: 'admin_guide_assist',
                    default: 'Admin Guide Assist', case: 'words'
                })}/>
                    {(this.state.adminGuideStarted) ? this.intl.translate({
                        key: 'only_one_tour_per_page',
                        default: 'You can only run one tour per page. Navigate to another page and remember to hit \'Refresh\'',
                        case: 'first'
                    }) : ''}

                </div>
            </AuthorizationFilter>*/}
      </div>
    )
  }
}
