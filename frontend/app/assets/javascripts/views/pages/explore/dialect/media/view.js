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
import Immutable, { Map } from 'immutable'
import classNames from 'classnames'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import {
  askToDisableResource,
  askToEnableResource,
  askToPublishResource,
  askToUnpublishResource,
  disableResource,
  enableResource,
  fetchResource,
  publishResource,
  unpublishResource,
} from 'providers/redux/reducers/fvResources'
import { changeTitleParams, overrideBreadcrumbs } from 'providers/redux/reducers/navigation'
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'
import UIHelpers from 'common/UIHelpers'

import Preview from 'views/components/Editor/Preview'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import PageToolbar from 'views/pages/explore/dialect/page-toolbar'

//import Header from 'views/pages/explore/dialect/header';
//import PageHeader from 'views/pages/explore/dialect/page-header';

import Dialog from 'material-ui/lib/dialog'

import Card from 'material-ui/lib/card/card'
import FlatButton from 'material-ui/lib/flat-button'
import CardText from 'material-ui/lib/card/card-text'

import ListUI from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'

import Tabs from 'material-ui/lib/tabs/tabs'
import Tab from 'material-ui/lib/tabs/tab'

import WordListView from 'views/pages/explore/dialect/learn/words/list-view'
import PhraseListView from 'views/pages/explore/dialect/learn/phrases/list-view'

import { WORKSPACES } from 'common/Constants'

import '!style-loader!css-loader!react-image-gallery/build/image-gallery.css'
import IntlService from 'views/services/intl'

const intl = IntlService.instance
/**
 * View word entry
 */
const { array, func, object, string } = PropTypes
export class View extends Component {
  static propTypes = {
    deleteResource: func, // TODO: NOT CERTAIN WHERE THIS COMES FROM
    routeParams: object.isRequired,
    // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computeLogin: object.isRequired,
    computeResource: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    askToDisableResource: func.isRequired,
    askToEnableResource: func.isRequired,
    askToPublishResource: func.isRequired,
    askToUnpublishResource: func.isRequired,
    changeTitleParams: func.isRequired,
    disableResource: func.isRequired,
    enableResource: func.isRequired,
    fetchDialect2: func.isRequired,
    fetchResource: func.isRequired,
    overrideBreadcrumbs: func.isRequired,
    pushWindowPath: func.isRequired,
    publishResource: func.isRequired,
    unpublishResource: func.isRequired,
  }
  static defaultProps = {
    deleteResource: () => {},
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      showThumbnailDialog: null,
    }
  }

  // Fetch data on initial render
  componentDidMount() {
    this._fetchData(this.props)
  }

  componentDidUpdate(prevProps /*, prevState*/) {
    // NOTE: he following was ported from `componentWillReceiveProps`
    // Refetch data on URL change
    const updatedDialectPath = prevProps.routeParams.dialect_path !== this.props.routeParams.dialect_path
    const updatedMedia = prevProps.routeParams.media !== this.props.routeParams.media
    if (updatedDialectPath || updatedMedia) {
      this._fetchData(this.props)
    }

    const media = selectn('response', ProviderHelpers.getEntry(this.props.computeResource, this._getMediaPath()))
    const title = selectn('properties.dc:title', media)
    const uid = selectn('uid', media)

    if (title && selectn('pageTitleParams.media', this.props.properties) != title) {
      this.props.changeTitleParams({ media: title })
      this.props.overrideBreadcrumbs({ find: uid, replace: 'pageTitleParams.media' })
    }
  }

  render() {
    const tabItemStyles = {
      userSelect: 'none',
    }

    const _computeEntities = Immutable.fromJS([
      {
        id: this._getMediaPath(),
        entity: this.props.computeResource,
      },
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
    ])

    const computeResource = this._getResource()
    const computeDialect2 = this._getDialect()

    const currentAppliedFilter = new Map({
      currentAppliedFilter: new Map({
        startsWith:
          ' AND ' +
          ProviderHelpers.switchWorkspaceSectionKeys(
            this._getMediaRelatedField(selectn('response.type', computeResource)),
            this.props.routeParams.area
          ) +
          " = '" +
          selectn('response.uid', computeResource) +
          "'",
      }),
    })

    /**
     * Generate definitions body
     */
    const computeResourceType = selectn('response.type', computeResource)
    const preview = computeResourceType ? (
      <Preview
        style={{ width: 'auto' }}
        initiallyExpanded
        metadataListStyles={{ maxHeight: 'initial' }}
        expandedValue={selectn('response', computeResource)}
        type={computeResourceType}
      />
    ) : null
    return (
      <PromiseWrapper computeEntities={_computeEntities}>
        {(() => {
          if (this.props.routeParams.area === WORKSPACES) {
            if (selectn('response', computeResource))
              return (
                <PageToolbar
                  label={intl.trans('media', 'Media', 'first')}
                  handleNavigateRequest={this.onNavigateRequest}
                  actions={['workflow', 'edit', 'publish-toggle', 'enable-toggle', 'publish']}
                  computeEntity={computeResource}
                  computePermissionEntity={computeDialect2}
                  computeLogin={this.props.computeLogin}
                  publishToggleAction={this.publishToggleAction}
                  publishChangesAction={this.publishChangesAction}
                  enableToggleAction={this.enableToggleAction}
                  {...this.props}
                />
              )
          }
        })()}
        <div className="row">
          <div className="col-xs-12">
            <div>
              <Card>
                <Tabs tabItemContainerStyle={tabItemStyles}>
                  <Tab label={intl.trans('overview', 'Overview', 'first')}>
                    <div>
                      <CardText>
                        <div className={classNames('col-md-8', 'col-xs-12')}>{preview}</div>

                        <div className={classNames('col-md-4', 'hidden-xs')}>
                          {(() => {
                            const thumbnails = selectn('response.properties.picture:views', computeResource) || []

                            if (thumbnails && thumbnails.length > 0) {
                              return (
                                <div>
                                  <ListUI
                                    subheader={intl.trans(
                                      'views.pages.explore.dialect.media.available_renditions',
                                      'Available Renditions'
                                    )}
                                  >
                                    {thumbnails.map((thumbnail, key) => {
                                      return (
                                        <ListItem
                                          onClick={() => this.setState({ showThumbnailDialog: thumbnail })}
                                          key={key}
                                          primaryText={thumbnail.title}
                                          secondaryText={
                                            <p>
                                              <span style={{ color: '#000' }}>{thumbnail.description}</span> -- (
                                              {thumbnail.width + 'x' + thumbnail.height})
                                            </p>
                                          }
                                        />
                                      )
                                    })}
                                  </ListUI>

                                  <Dialog
                                    contentStyle={{
                                      textAlign: 'center',
                                      height: '500px',
                                      maxHeight: '500px',
                                    }}
                                    autoScrollBodyContent
                                    title={selectn('title', this.state.showThumbnailDialog)}
                                    actions={[
                                      <FlatButton
                                        key="FlatButton0"
                                        label={intl.trans('close', 'Close', 'first')}
                                        secondary
                                        onClick={() => this.setState({ showThumbnailDialog: null })}
                                      />,
                                    ]}
                                    modal={false}
                                    open={this.state.showThumbnailDialog === null ? false : true}
                                    onRequestClose={() => this.setState({ showThumbnailDialog: null })}
                                  >
                                    <p>
                                      <img
                                        src={selectn('content.data', this.state.showThumbnailDialog)}
                                        alt={selectn('title', this.state.showThumbnailDialog)}
                                        style={{ maxHeight: '500px' }}
                                      />
                                    </p>
                                    <p>
                                      <input
                                        readOnly
                                        type="text"
                                        value={selectn('content.data', this.state.showThumbnailDialog)}
                                        style={{ width: '100%', padding: '5px' }}
                                      />
                                    </p>
                                  </Dialog>
                                </div>
                              )
                            }
                          })()}
                        </div>
                      </CardText>
                    </div>
                  </Tab>
                  <Tab
                    label={
                      UIHelpers.isViewSize('xs')
                        ? intl.trans('words', 'Words', 'first')
                        : intl.trans('linked_words', 'Linked Words', 'words')
                    }
                    id="find_words"
                  >
                    <div>
                      <CardText>
                        <h2>
                          {intl.trans('views.pages.explore.dialect.media.words_featuring', 'Words Featuring')}
                          <strong>{selectn('response.title', computeResource)}</strong>
                        </h2>
                        <div className="row">
                          <WordListView filter={currentAppliedFilter} routeParams={this.props.routeParams} />
                        </div>
                      </CardText>
                    </div>
                  </Tab>
                  <Tab
                    label={
                      UIHelpers.isViewSize('xs')
                        ? intl.trans('phrases', 'Phrases', 'first')
                        : intl.trans('linked_phrases', 'Linked Phrases', 'words')
                    }
                    id="find_phrases"
                  >
                    <div>
                      <CardText>
                        <h2>
                          {intl.trans('views.pages.explore.dialect.media.words_featuring_with', 'Words Featuring with')}
                          <strong>{selectn('response.title', computeResource)}</strong>
                        </h2>
                        <div className="row">
                          <PhraseListView filter={currentAppliedFilter} routeParams={this.props.routeParams} />
                        </div>
                      </CardText>
                    </div>
                  </Tab>
                </Tabs>
              </Card>
            </div>
          </div>
        </div>
      </PromiseWrapper>
    )
  }

  /**
   * Toggle dialect (enabled/disabled)
   */
  enableToggleAction = (toggled, workflow) => {
    if (toggled) {
      if (workflow) {
        this.props.askToEnableResource(
          this._getMediaPath(),
          {
            id: 'FVEnableLanguageAsset',
            start: 'true',
          },
          null,
          intl.trans(
            'views.pages.explore.dialect.media.request_to_enable_success',
            'Request to enable resource successfully submitted!'
          ),
          null
        )
      } else {
        this.props.enableResource(
          this._getMediaPath(),
          null,
          null,
          intl.trans('views.pages.explore.dialect.media.resource_enabled', 'Resource enabled!')
        )
      }
    } else {
      if (workflow) {
        this.props.askToDisableResource(
          this._getMediaPath(),
          {
            id: 'FVDisableLanguageAsset',
            start: 'true',
          },
          null,
          intl.trans(
            'views.pages.explore.dialect.media.request_to_disable_success',
            'Request to disable resource successfully submitted!'
          ),
          null
        )
      } else {
        this.props.disableResource(
          this._getMediaPath(),
          null,
          null,
          intl.trans('views.pages.explore.dialect.media.resource_disabled', 'Resource disabled!')
        )
      }
    }
  }

  /**
   * onNavigateRequest
   */
  onNavigateRequest = (path) => {
    this.props.pushWindowPath(path)
  }

  /**
   * Publish changes
   */
  publishChangesAction = () => {
    this.props.publishResource(
      this._getMediaPath(),
      null,
      null,
      intl.trans('views.pages.explore.dialect.media.resource_published_success', 'Resource published successfully!')
    )
  }

  /**
   * Toggle published dialect
   */
  publishToggleAction = (toggled, workflow) => {
    if (toggled) {
      if (workflow) {
        this.props.askToPublishResource(
          this._getMediaPath(),
          {
            id: 'FVPublishLanguageAsset',
            start: 'true',
          },
          null,
          intl.trans(
            'views.pages.explore.dialect.media.request_to_publish_success',
            'Request to publish resource successfully submitted!'
          ),
          null
        )
      } else {
        this.props.publishResource(
          this._getMediaPath(),
          null,
          null,
          intl.trans('views.pages.explore.dialect.media.resource_published_success', 'Resource published successfully!')
        )
      }
    } else {
      if (workflow) {
        this.props.askToUnpublishResource(
          this._getMediaPath(),
          {
            id: 'FVUnpublishLanguageAsset',
            start: 'true',
          },
          null,
          intl.trans(
            'views.pages.explore.dialect.media.request_to_unpublic_success',
            'Request to unpublish resource successfully submitted!'
          ),
          null
        )
      } else {
        this.props.unpublishResource(
          this._getMediaPath(),
          null,
          null,
          intl.trans(
            'views.pages.explore.dialect.media.resource_unpublished_success',
            'Resource unpublished successfully!'
          )
        )
      }
    }
  }

  // _internal methods
  _fetchData = (newProps) => {
    if (!this._getDialect(newProps)) {
      newProps.fetchDialect2(newProps.routeParams.dialect_path)
    }

    if (!this._getResource(newProps)) {
      newProps.fetchResource(this._getMediaPath(newProps))
    }
  }

  _getDialect = (props = this.props) => {
    return ProviderHelpers.getEntry(props.computeDialect2, props.routeParams.dialect_path)
  }

  _getMediaPath = (props = null) => {
    const _props = props === null ? this.props : props

    if (StringHelpers.isUUID(_props.routeParams.media)) {
      return _props.routeParams.media
    }
    return _props.routeParams.dialect_path + '/Resources/' + StringHelpers.clean(_props.routeParams.media)
  }

  _getMediaRelatedField = (type) => {
    switch (type) {
      case 'FVAudio':
        return 'fv:related_audio'

      case 'FVVideo':
        return 'fv:related_videos'

      case 'FVPicture':
        return 'fv:related_pictures'
      default: // NOTE: do nothing
    }
  }

  _getResource = (props = this.props) => {
    return ProviderHelpers.getEntry(props.computeResource, this._getMediaPath())
  }

  // TODO: this being used?
  _handleConfirmDelete = (item) => {
    this.props.deleteResource(item.uid) // TOOD: NOT CERTAIN WHERE THIS COMES FROM
    this.setState({ deleteDialogOpen: false })
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvResources, navigation, nuxeo, windowPath } = state

  const { properties } = navigation
  const { computeLogin } = nuxeo
  const { computeDialect2 } = fvDialect
  const { computeResource } = fvResources
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeDialect2,
    computeLogin,
    computeResource,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  askToDisableResource,
  askToEnableResource,
  askToPublishResource,
  askToUnpublishResource,
  changeTitleParams,
  disableResource,
  enableResource,
  fetchDialect2,
  fetchResource,
  overrideBreadcrumbs,
  pushWindowPath,
  publishResource,
  unpublishResource,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(View)
