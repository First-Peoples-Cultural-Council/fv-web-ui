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
import { List } from "immutable"
import selectn from "selectn"

import Colors from "material-ui/lib/styles/colors"

import ActionGrade from "material-ui/lib/svg-icons/action/grade"
import provide from "react-redux-provide"
import ProviderHelpers from "common/ProviderHelpers"
import UIHelpers from "common/UIHelpers"
import NavigationHelpers from "common/NavigationHelpers"
import IntlService from "views/services/intl"

const intl = IntlService.instance
@provide
export default class PortalListDialects extends Component {
  static propTypes = {
    items: PropTypes.oneOfType([PropTypes.array, PropTypes.instanceOf(List)]),
    filteredItems: PropTypes.oneOfType([PropTypes.array, PropTypes.instanceOf(List)]),
    fieldMapping: PropTypes.object,
    pushWindowPath: PropTypes.func.isRequired,
    theme: PropTypes.string.isRequired,
    showOnlyUserDialects: PropTypes.bool,
  }

  static defaultProps = {
    fieldMapping: {
      title: "properties.dc:title",
      logo: "properties.file:content",
    },
    showOnlyUserDialects: false,
  }

  constructor(props, context) {
    super(props, context)
  }

  render() {
    let items = this.props.filteredItems || this.props.items

    if (this.props.showOnlyUserDialects) {
      items = items.filter((tile) => ProviderHelpers.isActiveRole(selectn("contextParameters.portal.roles", tile)))
    }

    return (
      <div className="DialectList">
        {items.map((tile, i) => {
          // Switch roles
          const dialectRoles = selectn("contextParameters.portal.roles", tile)
          let actionIcon = null

          if (ProviderHelpers.isActiveRole(dialectRoles)) {
            actionIcon = <ActionGrade style={{ margin: "0 15px" }} color={Colors.amber200} />
          }

          // Dialect title
          const title = selectn(this.props.fieldMapping.title, tile)
          const logo = selectn(this.props.fieldMapping.logo, tile)
          const dialectCoverImage = encodeURI(UIHelpers.getThumbnail(logo, "Medium"))
          const dialectDescription = IntlService.instance.searchAndReplace(tile.description) || null
          const href = `/${this.props.theme}${tile.path.replace("/Portal", "")}`

          return (
            <a
              key={tile.uid}
              className="Dialect"
              href={href}
              onClick={(e) => {
                e.preventDefault()
                NavigationHelpers.navigate(href, this.props.pushWindowPath, false)
              }}
              title={title}
            >
              <span className="DialectCover" style={{ backgroundImage: `url('${dialectCoverImage}')` }} />
              <span className="DialectData">
                <span className="DialectTitle fontAboriginalSans">
                  {IntlService.instance.searchAndReplace(title)} {actionIcon}
                </span>
                {dialectDescription && <span className="DialectDescription">{dialectDescription}</span>}
              </span>
            </a>
          )
        })}
      </div>
    )
  }
}
