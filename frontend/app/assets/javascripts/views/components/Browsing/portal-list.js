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
import Immutable, { List, Map } from "immutable"
import selectn from "selectn"

import Colors from "material-ui/lib/styles/colors"

import GridList from "material-ui/lib/grid-list/grid-list"
import GridTile from "material-ui/lib/grid-list/grid-tile"
import ActionGrade from "material-ui/lib/svg-icons/action/grade"

import ProviderHelpers from "common/ProviderHelpers"
import UIHelpers from "common/UIHelpers"
import IntlService from "views/services/intl"

const intl = IntlService.instance
export default class PortalList extends Component {
  static propTypes = {
    items: PropTypes.oneOfType([PropTypes.array, PropTypes.instanceOf(List)]),
    filteredItems: PropTypes.oneOfType([PropTypes.array, PropTypes.instanceOf(List)]),
    action: PropTypes.func,
    cols: PropTypes.number,
    fieldMapping: PropTypes.object,
  }

  static defaultProps = {
    cols: 3,
    fieldMapping: {
      title: "properties.dc:title",
      logo: "properties.file:content",
    },
  }

  constructor(props, context) {
    super(props, context)
  }

  render() {
    let items = this.props.filteredItems || this.props.items

    return (
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around" }}>
        <GridList
          cols={UIHelpers.isViewSize("xs") ? 2 : this.props.cols}
          cellHeight={146}
          style={{ width: "100%", overflowY: "auto", marginBottom: 24 }}
        >
          {items.map(
            function(tile, i) {
              // Switch roles
              let dialectRoles = selectn("contextParameters.portal.roles", tile)
              //let roleDesc = '';
              let actionIcon = null

              if (ProviderHelpers.isActiveRole(dialectRoles)) {
                actionIcon = <ActionGrade style={{ margin: "0 15px" }} color={Colors.amber200} />
                //roleDesc = " ROLE(S): " + dialectRoles.join(", ")
              }

              // Dialect title
              let title = selectn(this.props.fieldMapping.title, tile)
              let logo = selectn(this.props.fieldMapping.logo, tile)

              return (
                <GridTile
                  onTouchTap={this.props.action.bind(this, tile.path.replace("/Portal", ""))}
                  key={tile.uid}
                  title={IntlService.instance.searchAndReplace(title)}
                  actionPosition="right"
                  actionIcon={actionIcon}
                  subtitle={IntlService.instance.searchAndReplace(tile.description) || ""}
                >
                  <img
                    src={UIHelpers.getThumbnail(logo, "Medium")}
                    alt={title + " " + intl.trans("logo", "Logo", "first")}
                  />
                </GridTile>
              )
            }.bind(this)
          )}
        </GridList>
      </div>
    )
  }
}
