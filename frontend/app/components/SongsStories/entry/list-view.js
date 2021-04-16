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
import { List } from 'immutable'
import classNames from 'classnames'

import NavigationHelpers from 'common/NavigationHelpers'

import BookEntry from 'components/SongsStories/entry/view'

import FVButton from 'components/FVButton'
import FVLabel from 'components/FVLabel'

const { func, array } = PropTypes

export default class SongsStoriesEntryListView extends Component {
  static propTypes = {
    splitWindowPath: array.isRequired,
    pushWindowPath: func.isRequired,
    handleSaveOrder: func.isRequired,
    items: PropTypes.oneOfType([PropTypes.array, PropTypes.instanceOf(List)]),
  }

  constructor(props, context) {
    super(props, context)

    const isList = List.isList(this.props.items)

    this.state = {
      items: isList ? this.props.items : List(this.props.items),
      originalItems: isList ? this.props.items : List(this.props.items),
      reorderWarning: isList ? true : false,
      reorderSuccess: false,
      reorderInProgress: false,
    }
    ;['_moveUp', '_moveDown', '_saveOrder'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  _moveUp(entry) {
    const entryIndex = this.state.items.findIndex((v) => {
      return v.uid === entry.uid
    })

    if (entryIndex - 1 >= 0) {
      const newList = this.state.items.delete(entryIndex).insert(entryIndex - 1, entry)

      this.setState({
        items: newList,
        reorderWarning: true,
        reorderSuccess: false,
      })

      this.props.sortOrderChanged(newList)
    }
  }

  _moveDown(entry) {
    const entryIndex = this.state.items.findIndex((v) => {
      return v.uid === entry.uid
    })

    if (entryIndex !== this.state.items.length) {
      const newList = this.state.items.delete(entryIndex).insert(entryIndex + 1, entry)

      this.setState({
        items: newList,
        reorderWarning: true,
        reorderSuccess: false,
      })

      this.props.sortOrderChanged(newList)
    }
  }

  _navigateToSongStory = () => {
    NavigationHelpers.navigateUpMultiple(this.props.splitWindowPath, this.props.pushWindowPath, 2)
  }

  _saveOrder() {
    this.props.handleSaveOrder()

    this.setState({
      reorderWarning: false,
      reorderInProgress: true,
      reorderSuccess: false,
    })

    // Give a few seconds for the update to complete
    // in case someone navigates away too quickly
    // on a very slow connection
    setTimeout(() => {
      this.setState({
        reorderWarning: false,
        reorderInProgress: false,
        reorderSuccess: true,
      })
    }, 1500)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.items != this.props.items) {
      this.setState({ items: List(nextProps.items) })
    }

    if (nextProps.metadata != this.props.metadata) {
      this.setState({ reorderWarning: false })
    }
  }

  render() {
    return (
      <div>
        {this.state.reorderSuccess ? (
          <div className={classNames('alert', 'alert-success')} role="alert">
            Your changes have been saved!
            <FVButton variant="contained" style={{ marginLeft: '15px' }} onClick={this._navigateToSongStory}>
              Back to Cover Page
            </FVButton>
          </div>
        ) : (
          ''
        )}

        {this.state.reorderInProgress ? (
          <div className={classNames('alert', 'alert-warning')} role="alert">
            Please wait... Your changes are being saved...
          </div>
        ) : (
          ''
        )}

        {this.state.reorderWarning ? (
          <div className={classNames('alert', 'alert-warning')} role="alert">
            Your changes to the order of pages have not been applied yet.
            <FVButton variant="contained" style={{ marginLeft: '15px' }} onClick={this._saveOrder}>
              Save Changes
            </FVButton>
          </div>
        ) : (
          ''
        )}
        {this.state.items.map(
          function (entry, i) {
            const entryControls = []

            if (this.props.reorder) {
              entryControls.push(
                <FVButton variant="contained" key="up" disabled={i == 0} onClick={this._moveUp.bind(this, entry)}>
                  <FVLabel transKey="move_up" defaultStr="move up" transform="words" />
                </FVButton>
              )
              entryControls.push(
                <FVButton
                  variant="contained"
                  key="down"
                  disabled={i == this.state.items.size - 1}
                  onClick={this._moveDown.bind(this, entry)}
                >
                  <FVLabel transKey="move_down" defaultStr="move down" transform="words" />
                </FVButton>
              )
            }

            return <BookEntry key={i} appendEntryControls={entryControls} entry={entry} {...this.props} />
          }.bind(this)
        )}
      </div>
    )
  }
}
