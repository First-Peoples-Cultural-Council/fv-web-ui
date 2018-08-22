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

import provide from 'react-redux-provide';
import selectn from 'selectn';

// Operations
import DirectoryOperations from 'operations/DirectoryOperations';

import ProviderHelpers from 'common/ProviderHelpers';

import PromiseWrapper from 'views/components/Document/PromiseWrapper';

import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';
import CircularProgress from 'material-ui/lib/circular-progress';
import IntlService from 'views/services/intl';

const intl = IntlService.instance;
/**
 * Explore Archive page shows all the families in the archive
 */
@provide
export default class ExploreArchive extends Component {

    static propTypes = {
        properties: PropTypes.object.isRequired,
        fetchLanguageFamilies: PropTypes.func.isRequired,
        computeLanguageFamilies: PropTypes.object.isRequired,
        pushWindowPath: PropTypes.func.isRequired
    };

    /*static contextTypes = {
        muiTheme: PropTypes.object.isRequired
    };*/

    constructor(props, context) {
        super(props, context);

        this.state = {
            pathOrId: null
        };

        // Bind methods to 'this'
        ['_onNavigateRequest'].forEach((method => this[method] = this[method].bind(this)));
    }

    fetchData(newProps) {
        const pathOrId = '/' + newProps.properties.domain + '/sections/';

        this.props.fetchLanguageFamilies(pathOrId);
        this.setState({pathOrId})
    }

    // Fetch data on initial render
    componentDidMount() {
        this.fetchData(this.props);
    }

    _onNavigateRequest(path) {
        this.props.pushWindowPath('/explore' + path);
    }

    render() {

        const computeEntities = Immutable.fromJS([{
            'id': this.state.pathOrId,
            'entity': this.props.computeLanguageFamilies
        }])

        const computeLanguageFamilies = ProviderHelpers.getEntry(this.props.computeLanguageFamilies, this.state.pathOrId);

        return <PromiseWrapper computeEntities={computeEntities}>
            <div className="row">
                <div className="col-md-4 col-xs-12">
                    <h1>{intl.translate({key: 'general.explore', default: 'Explore Languages', case: 'title'})}</h1>
                </div>
                <div className="col-md-8 col-xs-12">
                    <h2>{intl.trans('views.pages.explore.dialect.category.browse_dialects', 'Browse the following Dialects', 'words')}:</h2>
                    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'}}>
                        <GridList
                            cols={2}
                            cellHeight={200}
                            style={{width: '100%', overflowY: 'auto', marginBottom: 24}}
                        >
                            {(selectn('response.entries', computeLanguageFamilies) || []).map((tile, i) =>
                                <GridTile
                                    onTouchTap={this._onNavigateRequest.bind(this, tile.path)}
                                    key={tile.uid}
                                    title={tile.title}
                                    subtitle={tile.description}
                                ><img src="/assets/images/cover.png"/></GridTile>
                            )}
                        </GridList>
                    </div>
                </div>
            </div>
        </PromiseWrapper>;
    }
}