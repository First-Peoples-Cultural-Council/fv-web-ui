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

import BookEntry from 'components/SongsStories/entry/view'

import FVButton from 'components/FVButton'
import FVLabel from 'components/FVLabel'

export default class SongsStoriesEntryListView extends Component {
  static propTypes = {
    items: PropTypes.oneOfType([PropTypes.array, PropTypes.instanceOf(List)]),
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      items: List(this.props.items),
      originalItems: List(this.props.items),
      reorderWarning: false,
    }
    ;['_moveUp', '_moveDown', '_reset'].forEach((method) => (this[method] = this[method].bind(this)))
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
      })

      this.props.sortOrderChanged(newList)
    }
  }

  _reset() {
    this.setState({
      items: this.state.originalItems,
      reorderWarning: false,
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.items != this.props.items) {
      this.setState({ items: List(nextProps.items), reorderWarning: false })
    }

    if (nextProps.metadata != this.props.metadata) {
      this.setState({ reorderWarning: false })
    }
  }

  render() {
    return (
      <div>
        {this.state.reorderWarning ? (
          <div className={classNames('alert', 'alert-warning')} role="alert">
            <FVLabel
              transKey="views.pages.explore.dialect.learn.songs_stories.edit_x_pages"
              defaultStr="Note: This new sort order will be saved once the book is saved in the 'Book' tab."
              transform="first"
            />
            <FVButton variant="contained" style={{ marginLeft: '15px' }} onClick={this._reset}>
              <FVLabel transKey="reset_order" defaultStr="Reset Order" transform="words" />
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
