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

import ConfGlobal from 'conf/local.json';
import selectn from 'selectn';

import provide from 'react-redux-provide';

import TextField from 'material-ui/lib/text-field';
import IconButton from 'material-ui/lib/icon-button';

import ProviderHelpers from 'common/ProviderHelpers';
import IntlService from 'views/services/intl';

const int = IntlService.instance;

/**
 * Explore Archive page shows all the families in the archive
 */
@provide
export default class SearchBar extends Component {

    static propTypes = {
        windowPath: PropTypes.string.isRequired,
        pushWindowPath: PropTypes.func.isRequired,
        splitWindowPath: PropTypes.array.isRequired
    };

    /*static contextTypes = {
        muiTheme: PropTypes.object.isRequired
    };*/

    constructor(props, context) {
        super(props, context);

        // Bind methods to 'this'
        ['_handleDialectSearchSubmit'].forEach((method => this[method] = this[method].bind(this)));
    }

    _handleDialectSearchSubmit() {
        let queryParam = this.refs.dialectSearchField.getValue();
        let dialectPath = ProviderHelpers.getDialectPathFromURLArray(this.props.splitWindowPath);
        this.props.pushWindowPath("/explore/" + dialectPath + '/search/' + queryParam);
    }

    render() {

        const searchBarStyles = {
            display: 'inline-block'
        }

        return <div style={searchBarStyles}>
            <TextField ref="dialectSearchField"
                       hintText={intl.trans('views.pages.explore.dialect.search_dialect', 'Search Dialect...', 'words')}
                       onEnterKeyDown={this._handleDialectSearchSubmit}/>
            <IconButton onTouchTap={this._handleDialectSearchSubmit} iconClassName="material-icons"
                        iconStyle={{fontSize: '24px'}}
                        tooltip={intl.trans('search', 'Search', 'first')}>search</IconButton>
        </div>;
    }
}


