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
} from 'reducers/fvResources'
import { changeTitleParams, overrideBreadcrumbs } from 'reducers/navigation'
import { fetchDialect2 } from 'reducers/fvDialect'
import { pushWindowPath } from 'reducers/windowPath'

import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'
import UIHelpers from 'common/UIHelpers'

import Preview from 'components/Preview'
import PromiseWrapper from 'components/PromiseWrapper'
import PageToolbar from 'components/PageToolbar'

import FVButton from 'components/FVButton'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'

import FVTab from 'components/FVTab'
import WordsListView from 'components/WordsCreateEdit/list-view'
import PhraseListView from 'components/Phrases/list-view'
import FVLabel from 'components/FVLabel'

import { WORKSPACES } from 'common/Constants'

import '!style-loader!css-loader!react-image-gallery/styles/css/image-gallery.css'

/**
 * View word entry
 */
const { array, func, object, string } = PropTypes
export class MediaView extends Component {
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
      tabValue: 0,
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

    if (title && selectn('pageTitleParams.media', this.props.properties) !== title) {
      this.props.changeTitleParams({ media: title })
      this.props.overrideBreadcrumbs({ find: uid, replace: 'pageTitleParams.media' })
    }
  }

  render() {
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
    const expandedValue = selectn('response', computeResource)
    const preview =
      computeResourceType && expandedValue ? (
        <Preview
          style={{ width: 'auto' }}
          initiallyExpanded
          metadataListStyles={{ maxHeight: 'initial' }}
          expandedValue={expandedValue}
          type={computeResourceType}
        />
      ) : null

    return (
      <PromiseWrapper computeEntities={_computeEntities}>
        {(() => {
          if (this.props.routeParams.area === WORKSPACES) {
            if (selectn('response', computeResource))
              return (
                <div className="row">
                  <PageToolbar
                    label={this.props.intl.trans('media', 'Media', 'first')}
                    handleNavigateRequest={this.onNavigateRequest}
                    actions={['workflow', 'edit', 'visibility', 'publish']}
                    computeEntity={computeResource}
                    computePermissionEntity={computeDialect2}
                    computeLogin={this.props.computeLogin}
                    publishChangesAction={this.publishChangesAction}
                    {...this.props}
                  />
                </div>
              )
          }
        })()}
        <div className="row">
          <div className="col-xs-12">
            <div>
              <Card>
                <FVTab
                  tabItems={[
                    { label: this.props.intl.trans('overview', 'Overview', 'first'), dataTestId: 'tabOverview' },
                    {
                      label: UIHelpers.isViewSize('xs')
                        ? this.props.intl.trans('words', 'Words', 'first')
                        : this.props.intl.trans('linked_words', 'Linked Words', 'words'),
                      id: 'find_words',
                    },
                    {
                      label: UIHelpers.isViewSize('xs')
                        ? this.props.intl.trans('phrases', 'Phrases', 'first')
                        : this.props.intl.trans('linked_phrases', 'Linked Phrases', 'words'),
                      id: 'find_phrases',
                    },
                  ]}
                  tabsValue={this.state.tabValue}
                  tabsOnChange={(e, tabValue) => this.setState({ tabValue })}
                />
                {this.state.tabValue === 0 && (
                  <Typography component="div" style={{ padding: 8 * 3 }}>
                    <div>
                      <CardContent>
                        <div className={classNames('col-md-8', 'col-xs-12')}>{preview}</div>

                        <div className={classNames('col-md-4', 'hidden-xs')}>
                          {(() => {
                            const thumbnails = selectn('response.properties.picture:views', computeResource) || []

                            if (thumbnails && thumbnails.length > 0) {
                              return (
                                <div>
                                  <List
                                    subheader={this.props.intl.trans(
                                      'views.pages.explore.dialect.media.available_renditions',
                                      'Available Renditions'
                                    )}
                                    component="div"
                                  >
                                    {thumbnails.map((thumbnail, key) => {
                                      return (
                                        <ListItem
                                          button
                                          onClick={() => this.setState({ showThumbnailDialog: thumbnail })}
                                          key={key}
                                        >
                                          <ListItemText
                                            primary={thumbnail.title}
                                            secondary={
                                              <p>
                                                <span style={{ color: '#000' }}>{thumbnail.description}</span>
                                                -- ({thumbnail.width + 'x' + thumbnail.height})
                                              </p>
                                            }
                                          />
                                        </ListItem>
                                      )
                                    })}
                                  </List>

                                  <Dialog
                                    open={this.state.showThumbnailDialog === null ? false : true}
                                    onClose={() => this.setState({ showThumbnailDialog: null })}
                                    fullWidth
                                    maxWidth="md"
                                  >
                                    <DialogTitle>{selectn('title', this.state.showThumbnailDialog)}</DialogTitle>
                                    <DialogContent>
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
                                    </DialogContent>
                                    <DialogActions>
                                      <FVButton
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => this.setState({ showThumbnailDialog: null })}
                                      >
                                        <FVLabel transKey="close" defaultStr="Close" transform="first" />
                                      </FVButton>
                                    </DialogActions>
                                  </Dialog>
                                </div>
                              )
                            }
                          })()}
                        </div>
                      </CardContent>
                    </div>
                  </Typography>
                )}
                {this.state.tabValue === 1 && (
                  <Typography component="div" style={{ padding: 8 * 3 }}>
                    <div>
                      <CardContent>
                        <h2>
                          <FVLabel
                            transKey="views.pages.explore.dialect.media.words_featuring"
                            defaultStr="Words Featuring"
                          />
                          <strong>{selectn('response.title', computeResource)}</strong>
                        </h2>
                        <div className="row">
                          <WordsListView filter={currentAppliedFilter} routeParams={this.props.routeParams} />
                        </div>
                      </CardContent>
                    </div>
                  </Typography>
                )}
                {this.state.tabValue === 2 && (
                  <Typography component="div" style={{ padding: 8 * 3 }}>
                    <div>
                      <CardContent>
                        <h2>
                          <FVLabel
                            transKey="views.pages.explore.dialect.media.words_featuring_with"
                            defaultStr="Words Featuring with"
                          />
                          <strong>{selectn('response.title', computeResource)}</strong>
                        </h2>
                        <div className="row">
                          <PhraseListView filter={currentAppliedFilter} routeParams={this.props.routeParams} />
                        </div>
                      </CardContent>
                    </div>
                  </Typography>
                )}
              </Card>
            </div>
          </div>
        </div>
      </PromiseWrapper>
    )
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
      { value: 'Republish' },
      null,
      this.props.intl.trans(
        'views.pages.explore.dialect.media.resource_published_success',
        'Resource published successfully!'
      )
    )
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
  const { fvDialect, fvResources, navigation, nuxeo, windowPath, locale } = state

  const { properties } = navigation
  const { computeLogin } = nuxeo
  const { computeDialect2 } = fvDialect
  const { computeResource } = fvResources
  const { splitWindowPath, _windowPath } = windowPath
  const { intlService } = locale

  return {
    computeDialect2,
    computeLogin,
    computeResource,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
    intl: intlService,
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

export default connect(mapStateToProps, mapDispatchToProps)(MediaView)
