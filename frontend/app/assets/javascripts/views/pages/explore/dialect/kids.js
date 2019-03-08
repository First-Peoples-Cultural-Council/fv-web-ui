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
import Immutable from 'immutable';

import classNames from 'classnames';
import provide from 'react-redux-provide';

import selectn from 'selectn';

import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';

import UIHelpers from 'common/UIHelpers';
import IntlService from 'views/services/intl';

const intl = IntlService.instance;

@provide
export default class Kids extends Component {

  static propTypes = {
    properties: PropTypes.object.isRequired,
    windowPath: PropTypes.string.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    portal: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired
  };

  constructor(props, context){
    super(props, context);

    // Bind methods to 'this'
    ['_onNavigateRequest'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath(path);
  }

  render() {

    const tileTitleStyle = {fontSize: '18px', marginLeft: '-16px'};
    const tileStyle = {textAlign: 'center', textTransform: 'uppercase'};

    return <div>

            <div className="row" style={{backgroundSize: 'cover', backgroundPosition: 'center center', backgroundImage: 'url("' + selectn('response.contextParameters.portal.fv-portal:background_top_image.views[3].url', this.props.portal) + '?inline=true")'}}>

              <div className={classNames('col-xs-12', 'col-md-8', 'col-md-offset-2')}>

                  <div style={{marginTop: '40px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', border: '15px rgba(255,255,255,0) solid', borderRadius: '15px', backgroundColor: 'rgba(255,255,255,0.4)'}}>
                    <GridList
                      cols={UIHelpers.isViewSize('xs') ? 1 : 2}
                      cellHeight={200}
                      style={{width: '100%', overflowY: 'auto', marginBottom: 0}}
                      >
                      <GridTile
                            onTouchTap={this._onNavigateRequest.bind(this, this.props.windowPath + '/learn/words/categories')}
                            key='words'
                            title={<span style={tileTitleStyle}>Words</span>}
                            style={tileStyle}
                            >
                          <div className={classNames('kids-image-grid-container', 'words-main')} />
                      </GridTile>

                      <GridTile
                            onTouchTap={this._onNavigateRequest.bind(this, this.props.windowPath + '/learn/phrases/categories')}
                            key='phrases'
                            title={<span style={tileTitleStyle}>Phrases</span>}
                            style={tileStyle}
                            >
                          <div className={classNames('kids-image-grid-container', 'phrases-main')} />
                      </GridTile>

                      <GridTile
                            onTouchTap={this._onNavigateRequest.bind(this, this.props.windowPath + '/learn/songs-stories')}
                            key='songs-stories'
                            title={<span style={tileTitleStyle}>Songs and Stories</span>}
                            style={tileStyle}
                            >
                          <div className={classNames('kids-image-grid-container', 'songs-stories-main')} />
                      </GridTile>

                      <GridTile
                            onTouchTap={this._onNavigateRequest.bind(this, this.props.windowPath + '/play')}
                            key='games'
                            title={<span style={tileTitleStyle}>Games</span>}
                            style={tileStyle}
                            >
                          <div className={classNames('kids-image-grid-container', 'games-main')} />
                      </GridTile>

                    </GridList>
                  </div>
              </div>
            </div>

        </div>;
  }
};