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
import PropTypes from 'prop-types';

import React, { Component } from 'react';
import Immutable, {List, Map} from 'immutable';
import classNames from 'classnames';

import BookEntry from 'views/pages/explore/dialect/learn/songs-stories/entry/view';

import RaisedButton from 'material-ui/lib/raised-button';
import selectn from 'selectn';
import IntlService from 'views/services/intl';

const intl = IntlService.instance;
export default class ListView extends Component {

    static propTypes = {
        items: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.instanceOf(List)
        ])
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            items: List(this.props.items),
            originalItems: List(this.props.items),
            reorderWarning: false
        };

        ['_moveUp', '_moveDown', '_reset'].forEach((method => this[method] = this[method].bind(this)));
    }

    _moveUp(entry) {

        let entryIndex = this.state.items.findIndex((v) => {
            return v.uid === entry.uid
        });

        if (entryIndex - 1 >= 0) {
            let newList = this.state.items.delete(entryIndex).insert(entryIndex - 1, entry);

            this.setState({
                items: newList,
                reorderWarning: true
            });

            this.props.sortOrderChanged(newList);
        }
    }

    _moveDown(entry) {

        let entryIndex = this.state.items.findIndex((v) => {
            return v.uid === entry.uid
        });

        if (entryIndex !== this.state.items.length) {
            let newList = this.state.items.delete(entryIndex).insert(entryIndex + 1, entry);

            this.setState({
                items: newList,
                reorderWarning: true
            });

            this.props.sortOrderChanged(newList);
        }

    }

    _reset() {
        this.setState({
            items: this.state.originalItems,
            reorderWarning: false
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.items != this.props.items) {
            this.setState({items: List(nextProps.items), reorderWarning: false});
        }

        if (nextProps.metadata != this.props.metadata) {
            this.setState({reorderWarning: false});
        }
    }

    render() {

        return <div>
            {(this.state.reorderWarning) ? <div className={classNames('alert', 'alert-warning')}
                                                role="alert">{intl.trans('views.pages.explore.dialect.learn.songs_stories.edit_x_pages', 'Note: This new sort order will be saved once the book is saved in the \'Book\' tab.', 'first')}
                <RaisedButton style={{marginLeft: '15px'}} label={intl.trans('reset_order', 'Reset Order', 'words')}
                              onTouchTap={this._reset}/></div> : ''}
            {(this.state.items).map(function (entry, i) {

                let entryControls = [];

                if (this.props.reorder) {
                    entryControls.push(<RaisedButton key="up" label={intl.trans('move_up', 'move up', 'words')}
                                                     disabled={(i == 0)} onTouchTap={this._moveUp.bind(this, entry)}/>);
                    entryControls.push(<RaisedButton key="down" label={intl.trans('move_down', 'move down', 'words')}
                                                     disabled={(i == this.state.items.size - 1)}
                                                     onTouchTap={this._moveDown.bind(this, entry)}/>);
                }

                return <BookEntry
                    key={i}
                    appendEntryControls={entryControls}
                    entry={entry}
                    {...this.props} />
            }.bind(this))}
        </div>;
    }
}