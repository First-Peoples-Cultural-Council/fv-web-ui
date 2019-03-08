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
import React, {Component, PropTypes} from 'react';
import Immutable, {List, Map} from 'immutable';
import classNames from 'classnames';
import selectn from 'selectn';

import ConfGlobal from 'conf/local.json';

import CardView from './card-view';

import Preview from 'views/components/Editor/Preview';
import IntlService from "views/services/intl";

export default class GeneralList extends Component {

    static propTypes = {
        card: PropTypes.element,
        items: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.instanceOf(List)
        ]),
        filteredItems: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.instanceOf(List)
        ]),
        fields: PropTypes.instanceOf(Map),
        type: PropTypes.string,
        theme: PropTypes.string,
        action: PropTypes.func,
        cols: PropTypes.number,
        cellHeight: PropTypes.number,
        wrapperStyle: PropTypes.object,
        style: PropTypes.object
    };

    static defaultProps = {
        cols: 3,
        cellHeight: 210,
        wrapperStyle: null,
        style: null
    }

    intl = IntlService.instance;

    constructor(props, context) {
        super(props, context);
    }

    render() {

        let items = this.props.filteredItems || this.props.items;

        if (selectn('length', items) == 0) {
            return <div style={{margin: '20px 0'}}>{this.intl.translate({
                key: 'no_results_found',
                default: 'No Results Found',
                case: 'first',
                append: '.'
            })}</div>;
        }

        let card = (this.props.card) || <CardView/>;

        return <div className="row" style={this.props.wrapperStyle}>
            {(items || []).map(function (item, i) {
                return React.cloneElement(card, {key: i, item: item, ...this.props});
            }.bind(this))}
        </div>;
    }
}