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
import React, { Component, PropTypes } from "react"
import Immutable, { List, Map } from "immutable"
import classNames from "classnames"
import provide from "react-redux-provide"
import selectn from "selectn"

import ConfGlobal from "conf/local.json"

import ProviderHelpers from "common/ProviderHelpers"
import StringHelpers from "common/StringHelpers"

import Preview from "views/components/Editor/Preview"
import PromiseWrapper from "views/components/Document/PromiseWrapper"
import MetadataPanel from "views/pages/explore/dialect/learn/base/metadata-panel"
import MediaPanel from "views/pages/explore/dialect/learn/base/media-panel"
import PageToolbar from "views/pages/explore/dialect/page-toolbar"
import SubViewTranslation from "views/pages/explore/dialect/learn/base/subview-translation"
import { getDialectClassname } from "views/pages/explore/dialect/helpers"
import TextHeader from "views/components/Document/Typography/text-header"

import AuthorizationFilter from "views/components/Document/AuthorizationFilter"

//import Header from 'views/pages/explore/dialect/header';
//import PageHeader from 'views/pages/explore/dialect/page-header';

import Dialog from "material-ui/lib/dialog"

import Avatar from "material-ui/lib/avatar"
import FlatButton from "material-ui/lib/flat-button"
import Divider from "material-ui/lib/divider"

import ListUI from "material-ui/lib/lists/list"
import ListItem from "material-ui/lib/lists/list-item"

import Toolbar from "material-ui/lib/toolbar/toolbar"
import ToolbarGroup from "material-ui/lib/toolbar/toolbar-group"
import ToolbarSeparator from "material-ui/lib/toolbar/toolbar-separator"
import FontIcon from "material-ui/lib/font-icon"
import RaisedButton from "material-ui/lib/raised-button"

import Tab from "material-ui/lib/tabs/tab"

import CircularProgress from "material-ui/lib/circular-progress"

import "!style-loader!css-loader!react-image-gallery/build/image-gallery.css"

import withActions from "views/hoc/view/with-actions"
import IntlService from "views/services/intl"

const intl = IntlService.instance
const DetailsViewWithActions = withActions(PromiseWrapper, true)

/**
 * View phrase entry
 */
@provide
export default class View extends Component {
  static propTypes = {
    properties: PropTypes.object.isRequired,
    windowPath: PropTypes.string.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    changeTitleParams: PropTypes.func.isRequired,
    overrideBreadcrumbs: PropTypes.func.isRequired,
    computeLogin: PropTypes.object.isRequired,
    fetchDialect2: PropTypes.func.isRequired,
    computeDialect2: PropTypes.object.isRequired,
    fetchPhrase: PropTypes.func.isRequired,
    computePhrase: PropTypes.object.isRequired,
    deletePhrase: PropTypes.func.isRequired,
    publishPhrase: PropTypes.func.isRequired,
    askToPublishPhrase: PropTypes.func.isRequired,
    unpublishPhrase: PropTypes.func.isRequired,
    askToUnpublishPhrase: PropTypes.func.isRequired,
    enablePhrase: PropTypes.func.isRequired,
    askToEnablePhrase: PropTypes.func.isRequired,
    disablePhrase: PropTypes.func.isRequired,
    askToDisablePhrase: PropTypes.func.isRequired,
    routeParams: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      deleteDialogOpen: false,
    }

    // Bind methods to 'this'
    ;["_onNavigateRequest"].forEach((method) => (this[method] = this[method].bind(this)))
  }

  fetchData(newProps) {
    newProps.fetchPhrase(this._getPhrasePath(newProps))
    newProps.fetchDialect2(newProps.routeParams.dialect_path)
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    if (nextProps.routeParams.dialect_path !== this.props.routeParams.dialect_path) {
      this.fetchData(nextProps)
    } else if (nextProps.routeParams.phrase !== this.props.routeParams.phrase) {
      this.fetchData(nextProps)
    }
    // else if (nextProps.computeLogin.success !== this.props.computeLogin.success) {
    //     this.fetchData(nextProps);
    // }
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props)
  }

  componentDidUpdate(prevProps, prevState) {
    let phrase = selectn("response", ProviderHelpers.getEntry(this.props.computePhrase, this._getPhrasePath()))
    let title = selectn("properties.dc:title", phrase)
    let uid = selectn("uid", phrase)

    if (title && selectn("pageTitleParams.phrase", this.props.properties) != title) {
      this.props.changeTitleParams({ phrase: title })
      this.props.overrideBreadcrumbs({ find: uid, replace: "pageTitleParams.phrase" })
    }
  }

  _getPhrasePath(props = null) {
    if (props == null) {
      props = this.props
    }

    if (StringHelpers.isUUID(props.routeParams.phrase)) {
      return props.routeParams.phrase
    } else {
      return props.routeParams.dialect_path + "/Dictionary/" + StringHelpers.clean(props.routeParams.phrase)
    }
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath(path)
  }

  render() {
    const tabItemStyles = {
      userSelect: "none",
    }

    const computeEntities = Immutable.fromJS([
      {
        id: this._getPhrasePath(),
        entity: this.props.computePhrase,
      },
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
    ])

    const computePhrase = ProviderHelpers.getEntry(this.props.computePhrase, this._getPhrasePath())
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    // Photos
    let photos = []
    let photosThumbnails = []

    ;(selectn("response.contextParameters.phrase.related_pictures", computePhrase) || []).map(function(picture, key) {
      let image = {
        original: selectn("views[2].url", picture),
        thumbnail: selectn("views[0].url", picture) || "/assets/images/cover.png",
        description: picture["dc:description"],
        key: key,
        id: picture.uid,
        object: picture,
      }
      photos.push(image)
      photosThumbnails.push(
        <img
          key={picture.uid}
          src={selectn("views[0].url", picture) || "/assets/images/cover.png"}
          alt={selectn("title", picture)}
          style={{ margin: "15px", maxWidth: "150px" }}
        />
      )
    })

    // Videos
    let videos = []
    let videoThumbnails = []

    ;(selectn("response.contextParameters.phrase.related_videos", computePhrase) || []).map(function(video, key) {
      let vid = {
        original: ConfGlobal.baseURL + video.path,
        thumbnail: selectn("views[0].url", video) || "/assets/images/cover.png",
        description: video["dc:description"],
        key: key,
        id: video.uid,
        object: video,
      }
      videos.push(vid)
      videoThumbnails.push(
        <video
          key={video.uid}
          src={ConfGlobal.baseURL + video.path}
          controls
          style={{ margin: "15px", maxWidth: "150px" }}
        />
      )
    })

    // Audio
    let audios = []

    ;(selectn("response.contextParameters.phrase.related_audio", computePhrase) || []).map(function(audio, key) {
      audios.push(
        <Preview styles={{ maxWidth: "350px" }} key={selectn("uid", audio)} expandedValue={audio} type="FVAudio" />
      )
    })

    let tabs = []

    if (photos.length > 0) {
      tabs.push(
        <Tab key="pictures" label={intl.trans("pictures", "Pictures", "first")}>
          <div style={{ maxHeight: "400px" }}>{photosThumbnails}</div>
        </Tab>
      )
    }

    if (videos.length > 0) {
      tabs.push(
        <Tab key="videos" label={intl.trans("videos", "Videos", "first")}>
          <div>{videoThumbnails}</div>
        </Tab>
      )
    }

    if (audios.length > 0) {
      tabs.push(
        <Tab key="audio" label={intl.trans("audio", "Audio", "first")}>
          <div>{audios}</div>
        </Tab>
      )
    }

    // Categories
    let phrase_books = []

    {
      ;(selectn("response.contextParameters.phrase.phrase_books", computePhrase) || []).map(function(phrase_book, key) {
        phrase_books.push(<span key={key}>{selectn("dc:title", phrase_book)}</span>)
      })
    }
    // Cultural notes
    let cultural_notes = []

    {
      ;(selectn("response.properties.fv:cultural_note", computePhrase) || []).map(function(cultural_note, key) {
        cultural_notes.push(<div key={key}>{intl.searchAndReplace(cultural_note)}</div>)
      })
    }
    const dialectClassName = getDialectClassname(computeDialect2)

    /**
     * Generate definitions body
     */
    return (
      <DetailsViewWithActions
        labels={{ single: "phrase" }}
        itemPath={this._getPhrasePath()}
        actions={["workflow", "edit", "publish-toggle", "enable-toggle", "publish"]}
        publishAction={this.props.publishPhrase}
        unpublishAction={this.props.unpublishPhrase}
        askToPublishAction={this.props.askToPublishPhrase}
        askToUnpublishAction={this.props.askToUnpublishPhrase}
        enableAction={this.props.enablePhrase}
        askToEnableAction={this.props.askToEnablePhrase}
        disableAction={this.props.disablePhrase}
        askToDisableAction={this.props.askToDisablePhrase}
        deleteAction={this.props.deletePhrase}
        onNavigateRequest={this._onNavigateRequest}
        computeItem={computePhrase}
        permissionEntry={computeDialect2}
        tabs={tabs}
        computeEntities={computeEntities}
        {...this.props}
      >
        <div className="row" style={{ marginTop: "15px" }}>
          <div className={classNames("col-xs-12", "col-md-7")}>
            <div>
              <div className={dialectClassName}>
                <TextHeader
                  title={selectn("response.title", computePhrase)}
                  tag="h1"
                  properties={this.props.properties}
                />
              </div>
              <hr />

              {(() => {
                if (phrase_books.length > 0) {
                  return (
                    <span>
                      <strong>{intl.trans("phrase_books", "Phrase Books", "words")}</strong>: {phrase_books}
                    </span>
                  )
                }
              })()}

              <SubViewTranslation
                group={selectn("response.properties.fv:definitions", computePhrase)}
                groupByElement="language"
                groupValue="translation"
              >
                <p>
                  <strong>{intl.trans("definitions", "Definitions", "first")}:</strong>
                </p>
              </SubViewTranslation>

              <SubViewTranslation
                group={selectn("response.properties.fv:literal_translation", computePhrase)}
                groupByElement="language"
                groupValue="translation"
              >
                <p>
                  <strong>{intl.trans("literal_translations", "Literal Translations", "words")}:</strong>
                </p>
              </SubViewTranslation>

              {(() => {
                if (cultural_notes.length > 0) {
                  return (
                    <div style={{ margin: "10px 0" }}>
                      <hr />
                      <p>
                        <strong>
                          {intl.trans(
                            "views.pages.explore.dialect.learn.words.cultural_notes",
                            "Cultural Notes",
                            "words"
                          )}
                          :
                        </strong>
                      </p>
                      {cultural_notes}
                    </div>
                  )
                }
              })()}

              <hr />

              {selectn("response", computePhrase) ? (
                <MetadataPanel properties={this.props.properties} computeEntity={computePhrase} />
              ) : (
                ""
              )}
            </div>
          </div>

          <div className={classNames("col-xs-12", "col-md-3")}>
            <h3>{intl.trans("audio", "Audio", "upper")}</h3>
            <div>
              {audios.length === 0 ? (
                <span>
                  {intl.trans(
                    "views.pages.explore.dialect.learn.words.no_audio_yet",
                    "No audio is available yet",
                    "first"
                  )}
                  .
                </span>
              ) : (
                audios
              )}
            </div>

            <MediaPanel label={intl.trans("photo_s", "PHOTO(s)", "upper")} type="FVPicture" items={photos} />
            <MediaPanel label={intl.trans("video_s", "VIDEO(s)", "upper")} type="FVVideo" items={videos} />
          </div>
        </div>
      </DetailsViewWithActions>
    )
  }
}
