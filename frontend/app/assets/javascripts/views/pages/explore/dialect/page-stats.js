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
import ConfGlobal from 'conf/local.json';
import selectn from 'selectn';

import provide from 'react-redux-provide';

import ProviderHelpers from 'common/ProviderHelpers';

import Paper from 'material-ui/lib/paper';

import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import RaisedButton from 'material-ui/lib/raised-button';
import Toggle from 'material-ui/lib/toggle';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import IconButton from 'material-ui/lib/icon-button';
import NavigationExpandMoreIcon from 'material-ui/lib/svg-icons/navigation/expand-more';
import CircularProgress from 'material-ui/lib/circular-progress';

import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import Statistics from 'views/components/Dashboard/Statistics';

import AuthorizationFilter from 'views/components/Document/AuthorizationFilter';

import IntlService from 'views/services/intl';

const intl = IntlService.instance;

@provide
export default class PageStats extends Component {

    static propTypes = {
        windowPath: PropTypes.string.isRequired,
        handleNavigateRequest: PropTypes.func,
        computeDialectStats: PropTypes.object.isRequired,
        dialectPath: PropTypes.string.isRequired
    };

    constructor(props, context) {
        super(props, context);

        [].forEach((method => this[method] = this[method].bind(this)));
    }

    render() {
        const computeDialectStats = ProviderHelpers.getEntry(this.props.computeDialectStats, this.props.dialectPath);

        if (!selectn('response', computeDialectStats)) {
            return <div>Loading...</div>;
        }

        return <Tabs>
            <Tab label="Words" id="statisticsWords">
                <Paper style={{padding: '15px'}} zDepth={2}>
                    <Statistics data={selectn('response', computeDialectStats)} docType="words"
                                headerText={intl.trans('words', 'Words', 'first')}/>
                </Paper>
            </Tab>

            <Tab label="Phrases" id="statisticsPhrases">
                <Paper style={{padding: '15px'}} zDepth={2}>
                    <Statistics data={selectn('response', computeDialectStats)} docType="phrases"
                                headerText={intl.trans('phrases', 'Phrases', 'first')}/>
                </Paper>
            </Tab>

            <Tab label="Songs" id="statisticsSongs">
                <Paper style={{padding: '15px'}} zDepth={2}>
                    <Statistics data={selectn('response', computeDialectStats)} docType="songs"
                                headerText={intl.trans('songs', 'Songs', 'first')}/>
                </Paper>
            </Tab>

            <Tab label="Stories" id="statisticsStories">
                <Paper style={{padding: '15px'}} zDepth={2}>
                    <Statistics data={selectn('response', computeDialectStats)} docType="stories"
                                headerText={intl.trans('stories', 'Stories', 'first')}/>
                </Paper>
            </Tab>
        </Tabs>;

        /*return <Toolbar>

                      <ToolbarGroup float="left">

                        {this.props.children}

                        {(() => {
                          if (this.props.actions.includes('workflow')) {

                              return <AuthorizationFilter filter={{role: 'Record', entity: selectn('response', permissionEntity), login: computeLogin}} style={toolbarGroupItem}>

                                <div>

                                  <span style={{paddingRight: '15px'}}>REQUEST: </span>

                                  <RaisedButton label={"Enable (" + (enableTasks.length + this.state.enableActions ) + ")"} disabled={selectn('response.state', computeEntity) != 'Disabled' && selectn('response.state', computeEntity) != 'New'} style={{marginRight: '5px', marginLeft: '0'}} secondary={true} onTouchTap={this._documentActionsStartWorkflow.bind(this, 'enable')} />
                                  <RaisedButton label={"Disable (" + (disableTasks.length + this.state.disableActions) + ")"} disabled={selectn('response.state', computeEntity) != 'Enabled' && selectn('response.state', computeEntity) != 'New'} style={{marginRight: '5px', marginLeft: '0'}} secondary={true} onTouchTap={this._documentActionsStartWorkflow.bind(this, 'disable')} />
                                  <RaisedButton label={"Publish (" + (publishTasks.length + this.state.publishActions) + ")"} disabled={selectn('response.state', computeEntity) != 'Enabled'} style={{marginRight: '5px', marginLeft: '0'}} secondary={true} onTouchTap={this._documentActionsStartWorkflow.bind(this, 'publish')} />
                                  <RaisedButton label={"Unpublish (" + (unpublishTasks.length + this.state.unpublishActions) + ")"} disabled={selectn('response.state', computeEntity) != 'Published'} style={{marginRight: '5px', marginLeft: '0'}} secondary={true} onTouchTap={this._documentActionsStartWorkflow.bind(this, 'unpublish')} />

                                </div>

                              </AuthorizationFilter>;
                          }
                        })()}


                        {(() => {
                          if (this.props.actions.includes('enable-toggle')) {

                              return <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', permissionEntity)}} style={toolbarGroupItem}>
                                <div style={{display:'inline-block', float: 'left', margin: '17px 5px 10px 5px', position:'relative'}}>
                                  <Toggle
                                    toggled={documentEnabled || documentPublished}
                                    onToggle={this._documentActionsToggleEnabled}
                                    ref="enabled"
                                    disabled={documentPublished}
                                    name="enabled"
                                    value="enabled"
                                    label="Enabled"/>
                                </div>
                              </AuthorizationFilter>;
                          }
                        })()}

                        {(() => {
                          if (this.props.actions.includes('publish-toggle')) {

                              return <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', permissionEntity)}} style={toolbarGroupItem}>
                                <div style={{display:'inline-block', float: 'left', margin: '17px 5px 10px 5px', position:'relative'}}>
                                  <Toggle
                                    toggled={documentPublished}
                                    onToggle={this._documentActionsTogglePublished}
                                    disabled={!documentEnabled && !documentPublished}
                                    name="published"
                                    value="published"
                                    label="Published"/>
                                </div>
                              </AuthorizationFilter>;
                          }
                        })()}

                      </ToolbarGroup>

                      <ToolbarGroup float="right">

                        {(() => {
                          if (this.props.actions.includes('publish')) {
                            return <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', permissionEntity)}} style={toolbarGroupItem}>
                              <RaisedButton data-guide-role="publish-changes" disabled={!documentPublished} label="Publish Changes" style={{marginRight: '5px', marginLeft: '0'}} secondary={true} onTouchTap={this._publishChanges} />
                            </AuthorizationFilter>;
                          }
                        })()}

                        {(() => {
                          if (this.props.actions.includes('edit')) {
                            return <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', computeEntity)}} style={toolbarGroupItem}>
                              <RaisedButton label={"Edit " + this.props.label} style={{marginRight: '5px', marginLeft: '0'}} primary={true} onTouchTap={this.props.handleNavigateRequest.bind(this, this.props.windowPath.replace('sections', 'Workspaces') + '/edit')} />
                            </AuthorizationFilter>;
                          }
                        })()}

                        {(() => {
                          if (this.props.actions.includes('add-child')) {
                            return <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', computeEntity)}} style={toolbarGroupItem}>
                                    <RaisedButton label="Add New Page" style={{marginRight: '5px', marginLeft: '0'}} onTouchTap={this.props.handleNavigateRequest.bind(this, this.props.windowPath + '/create')} primary={true} />
                            </AuthorizationFilter>;
                          }
                        })()}

                        <ToolbarSeparator />

                        {(() => {
                          if (this.props.actions.includes('more-options')) {
                            return <IconMenu anchorOrigin={{horizontal: 'right', vertical: 'top'}} targetOrigin={{horizontal: 'right', vertical: 'top'}} iconButtonElement={
                                    <IconButton tooltip="More Options" tooltipPosition="top-center" touch={true}>
                                      <NavigationExpandMoreIcon />
                                    </IconButton>
                                  }>
                                    <MenuItem onTouchTap={this.props.handleNavigateRequest.bind(this, this.props.windowPath + '/reports')} primaryText="Reports" />
                                    <MenuItem onTouchTap={this.props.handleNavigateRequest.bind(this, this.props.windowPath + '/media')} primaryText="Media Browser" />
                                  </IconMenu>;
                          }
                        })()}



                      </ToolbarGroup>

                    </Toolbar>;*/
    }
}
