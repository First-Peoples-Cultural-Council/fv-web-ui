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
import _ from 'underscore'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import IntlService from 'views/services/intl'

const intl = IntlService.instance
export default class SubViewTranslation extends Component {
  static defaultProps = {}
  static propTypes = {
    group: PropTypes.any, // TODO: set appropriate propType
    children: PropTypes.any, // TODO: set appropriate propType
  }
  /*static containerStyles = {
      borderWidth: '1px',
      borderStyle: 'dashed',
      borderColor: '#efefef',
      margin: '10px 0',
      padding: '10px'
    };*/

  static tabsStyles = {
    tabItemContainerStyle: {
      backgroundColor: 'transparent',
    },
  }

  static tabStyles = {
    headline: {
      fontSize: 15,
      color: '#666666',
      paddingTop: 1,
      paddingBottom: 0,
      marginBottom: 0,
      textAlign: 'left',
    },
  }

  constructor(props, context) {
    super(props, context)
  }

  render() {
    const _this = this

    if (!this.props.group) return <div />

    const grouped = _.groupBy(this.props.group, (obj) => {
      return obj[_this.props.groupByElement]
    })

    if (!grouped || _.isEmpty(grouped)) return <div />

    return (
      <div className="row">
        <div className={classNames('col-xs-12', 'col-md-2')} style={{ marginTop: '10px' }}>
          {this.props.children}
        </div>

        <div className={classNames('col-xs-12', 'col-md-10')}>
          <Tabs tabItemContainerStyle={SubViewTranslation.tabsStyles.tabItemContainerStyle}>
            {_.map(grouped, (group, key) => {
              return (
                <Tab style={SubViewTranslation.tabStyles.headline} label={intl.searchAndReplace(key) + ':'} key={key}>
                  <List>
                    {group.map((groupValue, _key) => {
                      return <ListItem key={_key} primaryText={groupValue[_this.props.groupValue]} />
                    })}
                  </List>
                </Tab>
              )
            })}
          </Tabs>
        </div>
      </div>
    )
  }
}
