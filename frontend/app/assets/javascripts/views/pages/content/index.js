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
import Immutable, {List} from 'immutable';

import provide from 'react-redux-provide';
import selectn from 'selectn';
import classNames from 'classnames';

import Colors from 'material-ui/lib/styles/colors';

import ProviderHelpers from 'common/ProviderHelpers';
import StringHelpers from 'common/StringHelpers';

import PromiseWrapper from 'views/components/Document/PromiseWrapper';

import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';
import CircularProgress from 'material-ui/lib/circular-progress';
import Paper from 'material-ui/lib/paper';
import RaisedButton from 'material-ui/lib/raised-button';

import TextField from 'material-ui/lib/text-field';

import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';

import TextHeader from 'views/components/Document/Typography/text-header';

import IntroCardView from 'views/components/Browsing/intro-card-view';
import IntlService from 'views/services/intl';

const intl = IntlService.instance;

/**
 * Explore Archive page shows all the families in the archive
 */
@provide
export default class PageContent extends Component {

    static propTypes = {
        area: PropTypes.string.isRequired,
        properties: PropTypes.object.isRequired,
        windowPath: PropTypes.string.isRequired,
        pushWindowPath: PropTypes.func.isRequired,
        computeLogin: PropTypes.object.isRequired,
        queryPage: PropTypes.func.isRequired,
        computePage: PropTypes.object.isRequired,
        changeTitleParams: PropTypes.func.isRequired,
        routeParams: PropTypes.object.isRequired
    };

    /*static contextTypes = {
        muiTheme: React.PropTypes.object.isRequired
    };*/

    constructor(props, context) {
        super(props, context);

        this.state = {
            mapVisible: false,
            pagePath: '/' + this.props.properties.domain + '/' + this.props.area + '/Site/Resources/',
            dialectsPath: '/' + this.props.properties.domain + '/' + this.props.area + '/',
        };

        ['_onNavigateRequest'].forEach((method => this[method] = this[method].bind(this)));
    }

    componentDidMount() {
        this.fetchData(this.props);
    }

    // Refetch data on URL change
    componentWillReceiveProps(nextProps) {
        if (nextProps.windowPath != this.props.windowPath) {
            this.fetchData(nextProps);
        }
    }

    fetchData(newProps) {
        newProps.queryPage(this.state.pagePath,
            ' AND fvpage:url LIKE \'' + StringHelpers.clean(newProps.routeParams.friendly_url) + '\'' +
            '&sortOrder=ASC' +
            '&sortBy=dc:title');
    }

    componentDidUpdate(prevProps, prevState) {
        let title = selectn('response.entries[0].properties.dc:title', ProviderHelpers.getEntry(this.props.computePage, this.state.pagePath));

        if (title && selectn('pageTitleParams.pageTitle', this.props.properties) != title) {
            this.props.changeTitleParams({'pageTitle': title});
        }
    }

    _onNavigateRequest(path) {
        this.props.pushWindowPath(path);
    }

    render() {

        const computeEntities = Immutable.fromJS([{
            'id': this.state.pagePath,
            'entity': this.props.computePage
        }])

        const computePage = ProviderHelpers.getEntry(this.props.computePage, this.state.pagePath);

        const page = selectn('response.entries[0].properties', computePage);

        // getting started page translated
        /*if (selectn('dc:title', page) === 'Get Started') {
            var originalContent = selectn('fvpage:blocks[0].text', page);
            var content = intl.trans('views.pages.get_started.page', originalContent)
            page['fvpage:blocks'][0]['text'] = content;
        } 

        // contribute page translated
        else if (selectn('dc:title', page) === 'Contribute') {
            var originalContent = selectn('fvpage:blocks[0].text', page);
            var content = intl.trans('views.pages.contribute.page', originalContent)
            page['fvpage:blocks'][0]['text'] = content;
        }*/

        const primary1Color = selectn('theme.palette.baseTheme.palette.primary1Color', this.props.properties);

        return <PromiseWrapper renderOnError={true} computeEntities={computeEntities}>

            <div className={classNames('row')} style={{margin: '25px 0'}}>

                <div className={classNames('col-xs-12')} style={{marginBottom: '15px'}}>
                    <TextHeader
                        title={intl.searchAndReplace(selectn('fvpage:blocks[0].title', page), 'first')}
                        tag="h1" properties={this.props.properties}/>

                    <div dangerouslySetInnerHTML={{__html: selectn('fvpage:blocks[0].text', page)}}></div>
                </div>

            </div>

        </PromiseWrapper>;
    }
}