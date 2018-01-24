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
import Immutable, { List, Map } from 'immutable';
import classNames from 'classnames';
import provide from 'react-redux-provide';
import ConfGlobal from 'conf/local.json';
import selectn from 'selectn';

import PromiseWrapper from 'views/components/Document/PromiseWrapper';

import TextHeader from 'views/components/Document/Typography/text-header';

import ProviderHelpers from 'common/ProviderHelpers';
import PageDialectLearnBase from 'views/pages/explore/dialect/learn/base';
import AlphabetListView from 'views/pages/explore/dialect/learn/alphabet/list-view';

import Paper from 'material-ui/lib/paper';
import FlatButton from 'material-ui/lib/flat-button';
import GridTile from 'material-ui/lib/grid-list/grid-tile';

import Header from 'views/pages/explore/dialect/header';
import ToolbarNavigation from 'views/pages/explore/dialect/learn/base/toolbar-navigation';
import LearningSidebar from 'views/pages/explore/dialect/learn/base/learning-sidebar';

class AlphabetGridTile extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return <GridTile key={selectn('uid', this.props.tile)} style={{border: '3px solid #e0e0e0', borderRadius: '5px', textAlign: 'center', paddingTop: '15px'}}>
      <span style={{fontSize: '2em'}}>{selectn('properties.fvcharacter:upper_case_character', this.props.tile)} {selectn('properties.dc:title', this.props.tile)}</span><br/><br/>
      <strong style={{fontSize: '1.3em'}}>{selectn('contextParameters.character.related_words[0].dc:title', this.props.tile)}</strong><br/>
      {selectn('contextParameters.character.related_words[0].fv:definitions[0].translation', this.props.tile) || selectn('contextParameters.character.related_words[0].fv:literal_translation[0].translation', this.props.tile)}
    </GridTile>;
  }
}

/**
* Learn alphabet
*/
@provide
export default class PageDialectLearnAlphabet extends PageDialectLearnBase {

  static defaultProps = {
    print: false
  }

  static propTypes = {
    properties: PropTypes.object.isRequired,
    navigateTo: PropTypes.func.isRequired,
    windowPath: PropTypes.string.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    fetchDocument: PropTypes.func.isRequired,
    computeDocument: PropTypes.object.isRequired, 
    computeLogin: PropTypes.object.isRequired, 
    fetchDialect2: PropTypes.func.isRequired,
    computeDialect2: PropTypes.object.isRequired,
    fetchCharacters: PropTypes.func.isRequired,
    computeCharacters: PropTypes.object.isRequired,
    updateDialect2: PropTypes.func.isRequired,
    fetchPortal: PropTypes.func.isRequired,
    computePortal: PropTypes.object.isRequired,
    updatePortal: PropTypes.func.isRequired,
    routeParams: PropTypes.object.isRequired,
    computeLogin: PropTypes.object.isRequired,
    print: PropTypes.bool
  };

  constructor(props, context) {
    super(props, context);
    // Bind methods to 'this'
    ['_onNavigateRequest'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  fetchData(newProps) {
    newProps.fetchDialect2(newProps.routeParams.dialect_path);
    newProps.fetchPortal(newProps.routeParams.dialect_path + '/Portal');

    newProps.fetchDocument(newProps.routeParams.dialect_path + '/Dictionary');

    newProps.fetchCharacters(newProps.routeParams.dialect_path + '/Alphabet', '&sortOrder=asc&sortBy=fvcharacter:alphabet_order');
  }

  _onCharAudioTouchTap(charAudioId) {
	  document.getElementById(charAudioId).play();
  }

  _onNavigateRequest(path) {
    const destination = this.props.navigateTo(path);
    const newPathArray = this.props.splitWindowPath.slice();

    newPathArray.push(destination.path);

    this.props.pushWindowPath('/' + newPathArray.join('/'));
  }

  render() {

    const computeEntities = Immutable.fromJS([{
      'id': this.props.routeParams.dialect_path,
      'entity': this.props.computeDialect2
    }, {
      'id': this.props.routeParams.dialect_path + '/Portal',
      'entity': this.props.computePortal
    }])

    const { updatePortal, updateDialect2, computeLogin } = this.props;

    const computeDocument = ProviderHelpers.getEntry(this.props.computeDocument, this.props.routeParams.dialect_path + '/Dictionary');
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path);
    const computePortal = ProviderHelpers.getEntry(this.props.computePortal, this.props.routeParams.dialect_path + '/Portal');

    const computeCharacters = ProviderHelpers.getEntry(this.props.computeCharacters, this.props.routeParams.dialect_path + '/Alphabet');   

    const isSection = this.props.routeParams.area === 'sections';

    const alphabetListView = <AlphabetListView pagination={false} routeParams={this.props.routeParams} dialect={selectn('response', computeDialect2)} />;

    if (this.props.print) {
      return <PromiseWrapper renderOnError={true} computeEntities={computeEntities}>

            <div className="row">
                <div className={classNames('col-xs-8', 'col-xs-offset-2')}>
                <h1>{selectn('response.title', computeDialect2)} Alphabet</h1>
                {React.cloneElement(alphabetListView, { gridListView: true, gridViewProps: {style:{overflowY: 'auto', maxHeight: '100%'}}, gridListTile: AlphabetGridTile, dialect: selectn('response', computeDialect2) })}
                </div>
            </div>
            
            </PromiseWrapper>;
    }

    return <PromiseWrapper computeEntities={computeEntities}>

              <Header
                portal={{compute: computePortal, update: updatePortal}}
                dialect={{compute: computeDialect2, update: updateDialect2}}
                login={computeLogin}
                routeParams={this.props.routeParams}>

                <ToolbarNavigation showStats={this._showStats} routeParams={this.props.routeParams} />

              </Header>

              <div className={classNames('row', 'dialect-body-container')} style={{marginTop: '15px'}}>
                      
              <div className={classNames('col-xs-12', 'col-md-7')}>
                  <TextHeader title={selectn('response.title', computeDialect2) + " Alphabet"} tag="h1" properties={this.props.properties} appendToTitle={<a href="alphabet/print" target="_blank"><i className="material-icons">print</i></a>} />
              
                  {(() => {

                      const characters = selectn('response.entries', computeCharacters);

                      if (characters && characters.length > 0) {
                          return <div style={{marginBottom: '20px'}}>
                          {selectn('response.entries', computeCharacters).map((char, i) =>
                            <Paper key={char.uid} style={{textAlign: 'center', margin: '5px', padding: '5px 10px', display: 'inline-block'}}>
                              <FlatButton onTouchTap={this._onNavigateRequest.bind(this, char.path.split('/')[char.path.split('/').length-1])} label={char.title} style={{minWidth: 'inherit', textTransform: 'initial'}} />
                              {(char.contextParameters.character.related_audio[0]) ? 
                                <span>
                                <a className="glyphicon glyphicon-volume-up" style={{textDecoration: 'none'}} onTouchTap={this._onCharAudioTouchTap.bind(this, 'charAudio' + char.uid)} />
                                  <audio id={'charAudio' + char.uid}  src={ConfGlobal.baseURL + char.contextParameters.character.related_audio[0].path} />
                                </span>
                              : ''}           
                            </Paper>
                          )}
                          </div>;
                        }

                    })()}
              </div>

              <div className={classNames('col-xs-12', 'col-md-4', 'col-md-offset-1')}>

                <LearningSidebar
                  isSection={isSection}
                  properties={this.props.properties}
                  dialect={{compute: computeDialect2, update: updateDialect2}} />


              </div>

            </div>

        </PromiseWrapper>;
  }
}