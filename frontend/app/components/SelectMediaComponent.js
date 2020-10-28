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
import { Map } from 'immutable'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchResources } from 'reducers/fvResources'
import { fetchSharedAudios } from 'reducers/fvAudio'
import { fetchSharedPictures } from 'reducers/fvPicture'
import { fetchSharedVideos } from 'reducers/fvVideo'

import selectn from 'selectn'
// import t from 'tcomb-form'
import classNames from 'classnames'

import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'

import FVButton from 'components/FVButton'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

import ActionInfo from '@material-ui/icons/Info'
import ActionInfoOutline from '@material-ui/icons/InfoOutlined'

import MediaList from 'components/MediaList'
import withPagination from 'components/withPagination'
import withFilter from 'components/withFilter'
import FVLabel from 'components/FVLabel'

// const gridListStyle = { width: '100%', height: '100vh', overflowY: 'auto', marginBottom: 10 }

const DefaultFetcherParams = {
  currentPageIndex: 1,
  pageSize: 10,
  filters: { 'properties.dc:title': { appliedFilter: '' }, dialect: { appliedFilter: '' } },
}

const { any, func, object, string } = PropTypes

class SharedResourceGridTile extends Component {
  static defaultProps = {}
  static propTypes = {
    tile: any, // TODO: set appropriate propType
    dialect: any, // TODO: set appropriate propType
    action: any, // TODO: set appropriate propType
    fileTypeTilePosition: any, // TODO: set appropriate propType
    preview: any, // TODO: set appropriate propType
    intl: object.isRequired,
  }
  constructor(props, context) {
    super(props, context)

    this.state = {
      showInfo: false,
    }
  }

  render() {
    const tile = this.props.tile
    const resourceParentDialect = selectn('contextParameters.ancestry.dialect', tile)
    let actionIcon = null

    const isFVShared = selectn('path', tile) && selectn('path', tile).indexOf('SharedResources') !== -1
    const isDialectShared = selectn('uid', resourceParentDialect) != selectn('uid', this.props.dialect)

    // If resource is from different dialect, show notification so user is aware
    if (isDialectShared || isFVShared) {
      const tooltip = isDialectShared
        ? this.props.intl.trans('shared_from_x', 'Shared from ' + selectn('dc:title', resourceParentDialect), null, [
          selectn('dc:title', resourceParentDialect),
        ])
        : this.props.intl.trans('shared_from_x_collection', 'Shared from FirstVoices Collection', null, ['FirstVoices'])
      actionIcon = (
        <Tooltip title={tooltip}>
          <IconButton>{isDialectShared ? <ActionInfoOutline /> : <ActionInfo />}</IconButton>
        </Tooltip>
      )
    }

    return (
      <GridListTile
        onClick={this.props.action ? this.props.action.bind(this, this.props.tile) : null}
        key={selectn('uid', tile)}
        style={{ height: '154px', width: '20%', padding: '2px' }}
        aria-label={tile.title}
      >
        {this.props.preview}
        <GridListTileBar
          title={selectn('properties.dc:title', tile)}
          actionPosition="right"
          titlePosition={this.props.fileTypeTilePosition}
          actionIcon={actionIcon}
          subtitle={
            <span>
              <strong>{Math.round(selectn('properties.common:size', tile) * 0.001)} KB</strong>
            </span>
          }
        />
      </GridListTile>
    )
  }
}

// REDUX: reducers/state
const SharedResourceGridTileMapStateToProps = (state /*, ownProps*/) => {
  const { locale } = state
  const { intlService } = locale

  return {
    intl: intlService,
  }
}

const SharedResourceGridTileConnected = connect(SharedResourceGridTileMapStateToProps, null)(SharedResourceGridTile)

class SelectMediaComponent extends Component {
  static propTypes = {
    dialect: object.isRequired,
    label: string.isRequired,
    onComplete: func.isRequired,
    type: string.isRequired,
    // REDUX: reducers/state
    computeLogin: object.isRequired,
    computeResources: object.isRequired,
    computeSharedAudios: object.isRequired,
    computeSharedPictures: object.isRequired,
    computeSharedVideos: object.isRequired,
    intl: object.isRequired,
    // REDUX: actions/dispatch/func
    fetchResources: func.isRequired,
    fetchSharedAudios: func.isRequired,
    fetchSharedPictures: func.isRequired,
    fetchSharedVideos: func.isRequired,
  }

  constructor(props) {
    super(props)

    // If initial filter value provided
    const providedTitleFilter = selectn('otherContext.providedFilter', this.props.dialect)
    const appliedParams = providedTitleFilter
      ? Object.assign({}, DefaultFetcherParams, {
        filters: { 'properties.dc:title': { appliedFilter: providedTitleFilter } },
      })
      : DefaultFetcherParams

    this.state = {
      open: false,
      fetcherParams: appliedParams,
      initialFormValue: {},
    }

    // Bind methods to 'this'
    ;['_handleOpen', '_handleClose', '_handleSelectElement', 'fetchData'].forEach(
      (method) => (this[method] = this[method].bind(this))
    )
  }

  render() {
    let fileTypeLabel = this.props.intl.trans('file', 'file', 'lower')
    // let fileTypeCellHeight = 210
    // let fileTypeTilePosition = 'bottom'

    switch (this.props.type) {
      case 'FVAudio':
        fileTypeLabel = this.props.intl.trans('audio_file', 'audio file', 'lower')
        // fileTypeCellHeight = 100
        // fileTypeTilePosition = 'top'
        break

      case 'FVPicture':
        fileTypeLabel = this.props.intl.trans('pictures', 'pictures', 'lower')
        break

      case 'FVVideo':
        fileTypeLabel = this.props.intl.trans('videos', 'videos', 'lower')
        // fileTypeTilePosition = 'top'
        break
      default: // Note: do nothing
    }

    const computeResources = ProviderHelpers.getEntry(this.props.computeResources, '/FV/Workspaces/')
    const dialect = this.props.dialect

    // NOTE: this class within the render function strikes me as odd, but it works
    // It is used by FilteredPaginatedMediaList (which is really MediaList/media-list.js)
    // and MediaList is using it with `React.createElement(this.props.gridListTile ...`
    // so it needs to be a class, function or tag name string and not an object
    class SharedResourceGridTileWithDialect extends React.Component {
      render() {
        return React.createElement(SharedResourceGridTileConnected, { ...this.props, dialect: dialect })
      }
    }

    const items =
      selectn('response.entries', computeResources) || selectn('response_prev.entries', computeResources) || []

    const FilteredPaginatedMediaList = withFilter(
      withPagination(MediaList, DefaultFetcherParams.pageSize),
      DefaultFetcherParams
    )

    return (
      <div style={{ display: 'inline' }}>
        <FVButton variant="outlined" onClick={this._handleOpen}>
          {this.props.label}
        </FVButton>
        <Dialog open={this.state.open} fullWidth maxWidth={false}>
          <DialogTitle>
            {`${this.props.intl.searchAndReplace(
              `Select existing ${fileTypeLabel} from ${selectn(
                'properties.dc:title',
                dialect
              )} dialect or shared resources`
            )}:`}
          </DialogTitle>
          <DialogContent>
            <div className={classNames('alert', 'alert-info', { hidden: !selectn('isFetching', computeResources) })}>
              <FVLabel
                transKey="loading_results_please_wait"
                defaultStr="Loading results, please wait."
                transform="first"
              />
              {/* <br /> */}
              {/* <LinearProgress variant="indeterminate" /> */}
            </div>
            <FilteredPaginatedMediaList
              isFetching={selectn('isFetching', computeResources)}
              action={this._handleSelectElement}
              cols={5}
              cellHeight={150}
              fetcherParams={this.state.fetcherParams}
              filterOptionsKey={'ResourcesSelector'}
              fetcher={this.fetchData}
              gridListTile={SharedResourceGridTileWithDialect}
              initialFormValue={this.state.initialFormValue}
              initialValues={{
                'dc:contributors': selectn('response.properties.username', this.props.computeLogin),
              }}
              items={items}
              metadata={selectn('response', computeResources) || selectn('response_prev', computeResources)}
              style={{ overflowY: 'auto', maxHeight: '100vh' }}
            />
          </DialogContent>
          <DialogActions>
            <FVButton
              data-testid="Dialog__SelectMediaComponentCancel"
              variant="contained"
              color="secondary"
              onClick={this._handleClose}
            >
              <FVLabel transKey="cancel" defaultStr="Cancel" transform="first" />
            </FVButton>
          </DialogActions>
        </Dialog>
      </div>
    )
  }

  getDefaultValues() {
    this.props.intl.trans('views.components.editor.upload_media', 'Upload Media', 'words')
  }

  fetchData(fetcherParams, initialFormValue) {
    if (selectn('path', this.props.dialect)) {
      // If searching for shared images, need to split filter into 2 groups so NXQL is formatted correctly.
      const group1 = new Map(fetcherParams.filters)
        .filter((v, k) => k === 'shared_fv' || k === 'shared_dialects')
        .toJS()
      const group2 = new Map(fetcherParams.filters)
        .filterNot((v, k) => k === 'shared_fv' || k === 'shared_dialects')
        .toJS()

      this.props.fetchResources(
        '/FV/Workspaces/',
        " AND ecm:primaryType LIKE '" +
          this.props.type +
          "'" +
          " AND ecm:isCheckedInVersion = 0 AND ecm:isTrashed = 0 AND ecm:currentLifeCycleState != 'Disabled'" +
          " AND (ecm:path STARTSWITH '" +
          StringHelpers.clean(selectn('path', this.props.dialect)) +
          "/Resources/'" +
          ProviderHelpers.filtersToNXQL(group1) +
          ')' +
          ProviderHelpers.filtersToNXQL(group2) +
          '&currentPageIndex=' +
          (fetcherParams.currentPageIndex - 1) +
          '&pageSize=' +
          fetcherParams.pageSize
      )

      this.setState({
        fetcherParams: fetcherParams,
        initialFormValue,
      })
    }
  }

  _handleClose() {
    this.setState({ open: false })
  }

  async _handleOpen() {
    await this.fetchData(this.state.fetcherParams)
    this.setState({ open: true })
  }

  _handleSelectElement(value) {
    this.props.onComplete(value)
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { nuxeo, fvResources, fvAudio, fvPicture, fvVideo, locale } = state

  const { computeLogin } = nuxeo
  const { computeResources } = fvResources
  const { computeSharedAudios } = fvAudio
  const { computeSharedPictures } = fvPicture
  const { computeSharedVideos } = fvVideo
  const { intlService } = locale

  return {
    computeLogin,
    computeResources,
    computeSharedAudios,
    computeSharedPictures,
    computeSharedVideos,
    intl: intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchResources,
  fetchSharedAudios,
  fetchSharedPictures,
  fetchSharedVideos,
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectMediaComponent)
